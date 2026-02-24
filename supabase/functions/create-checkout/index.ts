import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

const getRequestOrigin = (req: Request): string => {
  const appUrl = Deno.env.get("APP_URL");
  if (appUrl && appUrl.startsWith("http")) {
    return appUrl.replace(/\/$/, "");
  }

  const originHeader = req.headers.get("origin");
  if (originHeader) return originHeader;

  const refererHeader = req.headers.get("referer");
  if (refererHeader) {
    try {
      return new URL(refererHeader).origin;
    } catch {
      // Ignore invalid referer and continue fallback chain.
    }
  }

  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  return "http://localhost:5173";
};

interface CheckoutRequest {
  attemptId: string;
  purchaseType: 'premium_report' | 'certificate' | 'bundle';
  paymentMethod?: 'card' | 'pix';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use anon client for auth verification
  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Use service role client for database operations (bypasses RLS)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // CRITICAL: Validate Stripe key is LIVE mode
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not configured");
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    // Block test keys in production - MUST use sk_live_
    if (stripeSecretKey.startsWith("sk_test_")) {
      logStep("ERROR: Test key detected - blocking checkout", { keyPrefix: "sk_test_" });
      throw new Error("STRIPE_SECRET_KEY is in test mode. Production requires LIVE key (sk_live_...)");
    }

    // Validate key format
    if (stripeSecretKey.startsWith("pk_")) {
      logStep("ERROR: Publishable key detected", { keyPrefix: "pk_" });
      throw new Error("Invalid key type: STRIPE_SECRET_KEY contains publishable key. Need secret key (sk_live_...)");
    }

    if (stripeSecretKey.startsWith("rk_")) {
      logStep("ERROR: Restricted key detected", { keyPrefix: "rk_" });
      throw new Error("Restricted keys not supported. Use full secret key (sk_live_...)");
    }

    const stripeMode = stripeSecretKey.startsWith("sk_live_") ? "LIVE" : "UNKNOWN";
    logStep("Stripe mode validated", { mode: stripeMode });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { attemptId, purchaseType, paymentMethod = 'card' } = await req.json() as CheckoutRequest;
    logStep("Request parsed", { attemptId, purchaseType, paymentMethod });

    // Get the test attempt to verify it exists and belongs to user (using admin client)
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      logStep("Attempt query failed", { error: attemptError?.message, attemptId, userId: user.id });
      throw new Error("Test attempt not found or doesn't belong to user");
    }
    logStep("Test attempt verified", { attemptId, score: attempt.total_score });

    // Get test name for dynamic product names
    const testName = attempt.test_name || 'Avaliação Cognitiva';
    
    // Define prices based on purchase type
    const prices: Record<string, { amount: number; name: string; description: string }> = {
      premium_report: {
        amount: 1990,
        name: `Relatório Premium - ${testName} - NEUROX`,
        description: 'Análise completa com interpretações detalhadas e recomendações personalizadas'
      },
      certificate: {
        amount: 1990,
        name: `Certificado Oficial - ${testName} - NEUROX`,
        description: 'Certificado personalizado com seu nome, resultado e código de validação único'
      },
      bundle: {
        amount: 2990,
        name: `Pacote Completo - ${testName} - NEUROX`,
        description: 'Relatório Premium + Certificado oficial personalizado'
      }
    };

    const product = prices[purchaseType];
    if (!product) throw new Error("Invalid purchase type");

    // Initialize Stripe with validated LIVE key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });
    logStep("Stripe initialized in LIVE mode");

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Customer lookup", { customerId: customerId || 'new customer' });

    // Determine success URL based on purchase type - redirect directly to result page
    const origin = getRequestOrigin(req);
    let successUrl: string;
    
    if (purchaseType === 'certificate') {
      successUrl = `${origin}/certificado/${attemptId}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    } else {
      // For premium report, redirect directly to resultado page with session for verification
      successUrl = `${origin}/resultado/${attemptId}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    }
    
    const baseSessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${origin}/payment/cancel?testAttemptId=${attemptId}`,
      metadata: {
        user_id: user.id,
        attempt_id: attemptId,
        purchase_type: purchaseType,
        test_name: testName,
      },
    };

    let session: Stripe.Checkout.Session;
    let pixAvailable = true;

    if (paymentMethod === 'pix') {
      session = await stripe.checkout.sessions.create({
        ...baseSessionConfig,
        payment_method_types: ['pix'],
      });
      logStep("Checkout session created with PIX", { sessionId: session.id });
    } else {
      try {
        // First attempt: explicitly request card + PIX.
        // If PIX is not enabled/available on the Stripe account, fallback handles card-only.
        const sessionWithCardAndPix = await stripe.checkout.sessions.create({
          ...baseSessionConfig,
          payment_method_types: ['card', 'pix'],
        });
        session = sessionWithCardAndPix;
        logStep("Checkout session created with card + PIX", { sessionId: session.id });
      } catch (cardPixError) {
        const errorMessage = cardPixError instanceof Error ? cardPixError.message : String(cardPixError);
        logStep("Card + PIX failed, trying card-only fallback", { error: errorMessage });
        
        // Check if error is PIX-related
        if (errorMessage.includes("pix") || errorMessage.includes("payment method")) {
          pixAvailable = false;
        }

        try {
          // Fallback: card only
          const sessionCardOnly = await stripe.checkout.sessions.create({
            ...baseSessionConfig,
            payment_method_types: ['card'],
          });
          session = sessionCardOnly;
          logStep("Checkout session created with card-only fallback", { sessionId: session.id });
        } catch (cardError) {
          const cardErrorMessage = cardError instanceof Error ? cardError.message : String(cardError);
          logStep("Card-only fallback also failed", { error: cardErrorMessage });
          throw cardError;
        }
      }
    }

    // Create purchase record using admin client
    const { error: purchaseError } = await supabaseAdmin
      .from('premium_purchases')
      .insert({
        user_id: user.id,
        attempt_id: attemptId,
        purchase_type: purchaseType,
        amount: product.amount / 100,
        currency: 'BRL',
        payment_method: paymentMethod,
        payment_status: 'pending',
        stripe_checkout_session_id: session.id,
      });

    if (purchaseError) {
      logStep("Warning: Failed to create purchase record", { error: purchaseError.message });
    }

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      pix_available: pixAvailable 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
