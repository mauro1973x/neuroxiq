import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-SESSION] ${step}${detailsStr}`);
};

interface VerifyRequest {
  sessionId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { sessionId } = await req.json() as VerifyRequest;
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Verifying session", { sessionId });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    logStep("Stripe session retrieved", { 
      status: session.status, 
      paymentStatus: session.payment_status 
    });

    // Verify the session belongs to this user via metadata
    const metadataUserId = session.metadata?.user_id;
    const attemptId = session.metadata?.attempt_id;
    const purchaseType = session.metadata?.purchase_type || 'premium_report';

    if (metadataUserId !== user.id) {
      logStep("User mismatch", { metadataUserId, currentUserId: user.id });
      throw new Error("Session does not belong to this user");
    }

    // Check if payment is successful
    if (session.payment_status !== 'paid') {
      logStep("Payment not completed", { paymentStatus: session.payment_status });
      return new Response(JSON.stringify({ 
        verified: false, 
        status: session.payment_status,
        message: "Payment not yet completed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Payment verified as paid, processing unlock", { attemptId, purchaseType });

    // Get payment intent ID
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent?.id;

    // Idempotency check - see if already processed
    const { data: existingPurchase } = await supabaseAdmin
      .from('premium_purchases')
      .select('payment_status')
      .eq('stripe_checkout_session_id', sessionId)
      .single();

    if (existingPurchase?.payment_status === 'approved') {
      logStep("Already processed, returning success");
      return new Response(JSON.stringify({ 
        verified: true,
        alreadyProcessed: true,
        attemptId,
        message: "Payment already processed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from('premium_purchases')
      .update({
        payment_status: 'approved',
        stripe_payment_intent_id: paymentIntentId,
      })
      .eq('stripe_checkout_session_id', sessionId);

    if (purchaseError) {
      logStep("Warning: Failed to update purchase", { error: purchaseError.message });
    }

    // Build update data for test attempt
    const updateFields: { [key: string]: unknown } = {
      payment_status: 'approved',
      purchased_at: new Date().toISOString(),
      premium_unlocked_at: new Date().toISOString(),
    };

    if (purchaseType === 'premium_report' || purchaseType === 'bundle') {
      updateFields.has_premium_access = true;
    }
    if (purchaseType === 'certificate' || purchaseType === 'bundle') {
      // Generate unique validation code for certificate
      const validationCode = 'NX-' + [...Array(10)].map(() => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
      ).join('');
      
      updateFields.has_certificate = true;
      updateFields.certificate_payment_status = 'paid';
      updateFields.certificate_issued_at = new Date().toISOString();
      updateFields.validation_code = validationCode;
      updateFields.stripe_certificate_session_id = sessionId;
    }

    const { error: attemptError } = await supabaseAdmin
      .from('test_attempts')
      .update(updateFields)
      .eq('id', attemptId)
      .eq('user_id', user.id);

    if (attemptError) {
      logStep("Failed to update attempt", { error: attemptError.message });
      throw new Error(`Failed to unlock premium: ${attemptError.message}`);
    }

    // Log the event for audit
    await supabaseAdmin
      .from('payment_events')
      .insert({
        stripe_event_id: `verify_${sessionId}_${Date.now()}`,
        event_type: 'session_verified',
        checkout_session_id: sessionId,
        payment_intent_id: paymentIntentId,
        user_id: user.id,
        attempt_id: attemptId,
        payload_summary: { source: 'verify-session', purchaseType },
        processed: true,
        processed_at: new Date().toISOString(),
      });

    logStep("Premium access granted successfully");

    return new Response(JSON.stringify({ 
      verified: true,
      attemptId,
      message: "Payment verified and premium access granted"
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
