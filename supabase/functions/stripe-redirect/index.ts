import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { createLogger } from "../_shared/logger.ts";

/**
 * GET endpoint that creates a Stripe Checkout session and returns a 303 redirect.
 * This bypasses iframe/sandbox restrictions by doing server-side redirect.
 * 
 * Usage: /stripe-redirect?attemptId=UUID&product=report|certificate|bundle
 */

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

serve(async (req) => {
  const logger = createLogger("stripe-redirect", req);
  const { logStep, requestId } = logger;

  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Request received");

    // CRITICAL: Validate Stripe key is LIVE mode FIRST
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not configured");
      return new Response("Payment system not configured", { status: 500 });
    }

    // Block test keys in production - MUST use sk_live_
    if (stripeSecretKey.startsWith("sk_test_")) {
      logStep("ERROR: Test key detected - blocking checkout", { keyPrefix: "sk_test_" });
      return new Response("Payment system in test mode. Contact support.", { status: 500 });
    }

    // Validate key format
    if (stripeSecretKey.startsWith("pk_")) {
      logStep("ERROR: Publishable key detected", { keyPrefix: "pk_" });
      return new Response("Invalid payment configuration", { status: 500 });
    }

    if (stripeSecretKey.startsWith("rk_")) {
      logStep("ERROR: Restricted key detected", { keyPrefix: "rk_" });
      return new Response("Invalid payment configuration", { status: 500 });
    }

    const stripeMode = stripeSecretKey.startsWith("sk_live_") ? "LIVE" : "UNKNOWN";
    logStep("Stripe mode validated", { mode: stripeMode });

    // Parse query parameters
    const url = new URL(req.url);
    const attemptId = url.searchParams.get("attemptId");
    const product = url.searchParams.get("product") || "report";

    if (!attemptId) {
      logStep("Missing attemptId");
      return new Response("attemptId is required", { status: 400 });
    }

    logStep("Parameters", { attemptId, product });

    // Get auth token from cookie or header
    const authHeader = req.headers.get("Authorization");
    const cookieHeader = req.headers.get("Cookie");
    
    let token: string | null = null;
    
    if (authHeader) {
      token = authHeader.replace("Bearer ", "");
    } else if (cookieHeader) {
      // Try to extract sb-access-token from cookies
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const accessTokenCookie = cookies.find(c => c.startsWith('sb-access-token='));
      if (accessTokenCookie) {
        token = accessTokenCookie.split('=')[1];
      }
    }

    // Create Supabase clients
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user if token exists
    let user = null;
    if (token) {
      const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
      if (!userError && userData.user) {
        user = userData.user;
        logStep("User authenticated", { userId: user.id, email: user.email });
      }
    }

    if (!user?.email) {
      // Redirect to login with return URL
      const origin = getRequestOrigin(req);
      const returnUrl = encodeURIComponent(`/resultado/${attemptId}`);
      const loginUrl = `${origin}/login?returnTo=${returnUrl}`;
      logStep("User not authenticated, redirecting to login");
      return new Response(null, {
        status: 303,
        headers: { "Location": loginUrl }
      });
    }

    // Get test attempt
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      logStep("Attempt not found", { error: attemptError?.message, attemptId, userId: user.id });
      return new Response("Test attempt not found or doesn't belong to user", { status: 404 });
    }

    logStep("Attempt found", { attemptId, testName: attempt.test_name });

    // Map product type to purchase details
    const testName = attempt.test_name || 'Avaliação Cognitiva';
    const productMap: Record<string, { purchaseType: string; amount: number; name: string; description: string }> = {
      report: {
        purchaseType: 'premium_report',
        amount: 1990,
        name: `Relatório Premium - ${testName} - NEUROX`,
        description: 'Análise completa com interpretações detalhadas e recomendações personalizadas'
      },
      certificate: {
        purchaseType: 'certificate',
        amount: 1990,
        name: `Certificado Oficial - ${testName} - NEUROX`,
        description: 'Certificado personalizado com seu nome, resultado e código de validação único'
      },
      bundle: {
        purchaseType: 'bundle',
        amount: 2990,
        name: `Pacote Completo - ${testName} - NEUROX`,
        description: 'Relatório Premium + Certificado oficial personalizado'
      }
    };

    const productDetails = productMap[product] || productMap.report;

    // Initialize Stripe with validated LIVE key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });
    logStep("Stripe initialized in LIVE mode");

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Customer lookup", { customerId: customerId || 'new' });

    // Determine URLs
    const origin = getRequestOrigin(req);
    
    let successUrl: string;
    if (product === 'certificate') {
      successUrl = `${origin}/certificado/${attemptId}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    } else {
      // For premium_report and bundle: redirect directly back to the result page
      // The result page calls verify-session to unlock content synchronously
      successUrl = `${origin}/resultado/${attemptId}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    }
    const cancelUrl = `${origin}/payment/cancel?testAttemptId=${attemptId}`;

    // Create checkout session requesting card + PIX first
    const baseConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: productDetails.name,
              description: productDetails.description,
            },
            unit_amount: productDetails.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        attempt_id: attemptId,
        purchase_type: productDetails.purchaseType,
        test_name: testName,
      },
    };

    let session: Stripe.Checkout.Session;

    try {
      session = await stripe.checkout.sessions.create({
        ...baseConfig,
        automatic_payment_methods: { enabled: true },
      });
      logStep("Session created with card + PIX", { sessionId: session.id });
    } catch (cardPixError) {
      logStep("Card + PIX failed, trying card-only", { error: cardPixError instanceof Error ? cardPixError.message : String(cardPixError) });
      session = await stripe.checkout.sessions.create({
        ...baseConfig,
        payment_method_types: ['card'],
      });
      logStep("Session created with card-only", { sessionId: session.id });
    }

    // Create purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from('premium_purchases')
      .insert({
        user_id: user.id,
        attempt_id: attemptId,
        purchase_type: productDetails.purchaseType,
        amount: productDetails.amount / 100,
        currency: 'BRL',
        payment_method: 'card',
        payment_status: 'pending',
        stripe_checkout_session_id: session.id,
      });

    if (purchaseError) {
      logStep("Warning: Failed to create purchase record", { error: purchaseError.message });
    }

    // Return 303 redirect to Stripe Checkout
    logStep("Redirecting to Stripe", { url: session.url?.substring(0, 50) + '...' });
    
    return new Response(null, {
      status: 303,
      headers: {
        "Location": session.url!,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("redirect_failed", { message: errorMessage });
    return new Response(`Error: ${errorMessage} (requestId: ${requestId})`, { status: 500 });
  }
});
