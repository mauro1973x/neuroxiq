import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { createLogger } from "../_shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VerifyRequest {
  sessionId: string;
  attemptId: string;
}

serve(async (req) => {
  const logger = createLogger("verify-payment", req);
  const { logStep, requestId } = logger;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { sessionId, attemptId } = await req.json() as VerifyRequest;
    logStep("Request parsed", { sessionId, attemptId });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      status: session.payment_status, 
      paymentIntent: session.payment_intent,
      purchaseType: session.metadata?.purchase_type
    });

    if (session.payment_status === 'paid') {
      // Update purchase record
      const { error: purchaseUpdateError } = await supabaseClient
        .from('premium_purchases')
        .update({
          payment_status: 'approved',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('stripe_checkout_session_id', sessionId);

      if (purchaseUpdateError) {
        logStep("Warning: Failed to update purchase", { error: purchaseUpdateError.message });
      }

      // Get purchase type from Stripe session metadata
      const purchaseType = session.metadata?.purchase_type || 'premium_report';
      logStep("Purchase type from metadata", { purchaseType });

      // Build update payload based on purchase type
      const updateData: Record<string, unknown> = {
        payment_status: 'approved',
        purchased_at: new Date().toISOString(),
      };

      if (purchaseType === 'premium_report' || purchaseType === 'bundle') {
        updateData.has_premium_access = true;
        updateData.premium_unlocked_at = new Date().toISOString();
      }

      if (purchaseType === 'certificate' || purchaseType === 'bundle') {
        // Generate a unique validation code for the certificate
        const validationCode = 'NX-' + [...Array(10)].map(() =>
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join('');

        updateData.has_certificate = true;
        updateData.certificate_payment_status = 'paid';
        updateData.certificate_issued_at = new Date().toISOString();
        updateData.validation_code = validationCode;
        updateData.stripe_certificate_session_id = sessionId;
        logStep("Certificate fields set", { validationCode });
      }

      const { error: attemptUpdateError } = await supabaseClient
        .from('test_attempts')
        .update(updateData)
        .eq('id', attemptId)
        .eq('user_id', user.id);

      if (attemptUpdateError) {
        logStep("Warning: Failed to update attempt", { error: attemptUpdateError.message });
      }

      logStep("Payment verified and access granted", { purchaseType, fields: Object.keys(updateData) });

      return new Response(JSON.stringify({ 
        success: true, 
        status: 'approved',
        purchaseType,
        hasPremiumAccess: purchaseType === 'premium_report' || purchaseType === 'bundle',
        hasCertificate: purchaseType === 'certificate' || purchaseType === 'bundle',
        requestId,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (session.payment_status === 'unpaid') {
      // Check if expired (for PIX)
      const isExpired = session.expires_at && session.expires_at * 1000 < Date.now();
      
      return new Response(JSON.stringify({ 
        success: false, 
        status: isExpired ? 'expired' : 'pending',
        requestId,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      status: session.payment_status,
      requestId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("verify_payment_failed", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage, requestId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
