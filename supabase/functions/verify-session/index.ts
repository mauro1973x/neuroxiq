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
      paymentStatus: session.payment_status,
      livemode: session.livemode
    });

    // Verify the session belongs to this user via metadata
    const metadataUserId = session.metadata?.user_id;
    const attemptId = session.metadata?.attempt_id;

    if (metadataUserId !== user.id) {
      logStep("User mismatch", { metadataUserId, currentUserId: user.id });
      throw new Error("Session does not belong to this user");
    }

    // Check current database status
    const { data: attemptData, error: attemptError } = await supabaseAdmin
      .from('test_attempts')
      .select('has_premium_access, has_certificate, payment_status, certificate_payment_status')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (attemptError) {
      logStep("Failed to fetch attempt", { error: attemptError.message });
      throw new Error("Failed to verify payment status");
    }

    // Determine purchase type from session metadata
    const purchaseType = session.metadata?.purchase_type || 'premium_report';
    logStep("Purchase type from metadata", { purchaseType });

    // Check if content is already unlocked based on purchase type
    const isPremiumAlreadyUnlocked = attemptData?.has_premium_access === true && attemptData?.payment_status === 'approved';
    const isCertificateAlreadyUnlocked = attemptData?.has_certificate === true && attemptData?.certificate_payment_status === 'paid';
    
    // For premium_report: check if premium is already unlocked
    // For certificate: check if certificate is already unlocked
    // For bundle: check if BOTH are unlocked
    const isAlreadyUnlocked = 
      (purchaseType === 'premium_report' && isPremiumAlreadyUnlocked) ||
      (purchaseType === 'certificate' && isCertificateAlreadyUnlocked) ||
      (purchaseType === 'bundle' && isPremiumAlreadyUnlocked && isCertificateAlreadyUnlocked);

    if (isAlreadyUnlocked) {
      logStep("Content already unlocked via webhook", { attemptId, purchaseType });
      return new Response(JSON.stringify({ 
        verified: true,
        alreadyProcessed: true,
        attemptId,
        purchaseType,
        message: "Payment confirmed and access granted"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // CRITICAL FIX: If Stripe shows payment_status='paid', unlock immediately
    // This handles cases where webhook is delayed/failed
    if (session.payment_status === 'paid') {
      logStep("Stripe confirmed PAID - unlocking access directly", { 
        attemptId, 
        sessionId,
        livemode: session.livemode,
        paymentIntent: session.payment_intent
      });

      // purchaseType already defined above from metadata
      const updateFields: Record<string, unknown> = {};

      if (purchaseType === 'premium_report' || purchaseType === 'bundle') {
        updateFields.has_premium_access = true;
        updateFields.payment_status = 'approved';
        updateFields.purchased_at = new Date().toISOString();
        updateFields.premium_unlocked_at = new Date().toISOString();
      }

      if (purchaseType === 'certificate' || purchaseType === 'bundle') {
        // Generate unique validation code
        const validationCode = 'NX-' + [...Array(10)].map(() => 
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join('');
        
        updateFields.has_certificate = true;
        updateFields.certificate_payment_status = 'paid';
        updateFields.certificate_issued_at = new Date().toISOString();
        updateFields.validation_code = validationCode;
        updateFields.stripe_certificate_session_id = sessionId;
      }

      // Only update if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('test_attempts')
          .update(updateFields)
          .eq('id', attemptId);

        if (updateError) {
          logStep("Failed to update attempt", { error: updateError.message });
          throw new Error("Failed to unlock content");
        }

        // Log this unlock for audit
        await supabaseAdmin
          .from('payment_events')
          .insert({
            stripe_event_id: `verify_unlock_${sessionId}_${Date.now()}`,
            event_type: 'session_verification_unlock',
            checkout_session_id: sessionId,
            user_id: user.id,
            attempt_id: attemptId,
            payment_intent_id: typeof session.payment_intent === 'string' 
              ? session.payment_intent 
              : session.payment_intent?.id,
            payload_summary: { 
              source: 'verify-session',
              action: 'direct_unlock',
              stripeStatus: session.payment_status,
              livemode: session.livemode,
              purchaseType,
              fields: Object.keys(updateFields)
            },
            processed: true,
            processed_at: new Date().toISOString(),
          });

        logStep("Access unlocked successfully via verify-session fallback", { 
          attemptId, 
          purchaseType,
          livemode: session.livemode
        });

        return new Response(JSON.stringify({ 
          verified: true,
          alreadyProcessed: false,
          attemptId,
          message: "Payment confirmed and access granted"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Payment not yet complete according to Stripe
    logStep("Payment not completed", { paymentStatus: session.payment_status });
    return new Response(JSON.stringify({ 
      verified: false, 
      status: session.payment_status,
      message: "Payment not yet completed"
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
