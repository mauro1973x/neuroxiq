import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // Verify webhook signature if secret is configured
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logStep("Webhook signature verification failed", { error: message });
        return new Response(JSON.stringify({ error: message }), { status: 400 });
      }
    } else {
      // Parse without verification (development mode)
      event = JSON.parse(body);
      logStep("Webhook parsed without signature verification (development mode)");
    }

    logStep("Event received", { type: event.type });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id, 
          paymentStatus: session.payment_status 
        });

        if (session.payment_status === 'paid') {
          await handleSuccessfulPayment(supabaseUrl, supabaseKey, session);
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        // For PIX payments that complete asynchronously
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Async payment succeeded (PIX)", { sessionId: session.id });
        await handleSuccessfulPayment(supabaseUrl, supabaseKey, session);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Async payment failed", { sessionId: session.id });
        
        // Update purchase status to rejected
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('premium_purchases')
          .update({ payment_status: 'rejected' })
          .eq('stripe_checkout_session_id', session.id);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session expired", { sessionId: session.id });
        
        // Update purchase status to expired
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('premium_purchases')
          .update({ payment_status: 'expired' })
          .eq('stripe_checkout_session_id', session.id);
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
});

async function handleSuccessfulPayment(
  supabaseUrl: string,
  supabaseKey: string,
  session: Stripe.Checkout.Session
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const attemptId = session.metadata?.attempt_id;
  const userId = session.metadata?.user_id;
  const purchaseType = session.metadata?.purchase_type || 'premium_report';

  logStep("Processing successful payment", { attemptId, userId, purchaseType });

  if (!attemptId || !userId) {
    logStep("Missing metadata", { attemptId, userId });
    return;
  }

  // Update purchase record
  const { error: purchaseError } = await supabase
    .from('premium_purchases')
    .update({
      payment_status: 'approved',
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('stripe_checkout_session_id', session.id);

  if (purchaseError) {
    logStep("Failed to update purchase", { error: purchaseError.message });
  }

  // Build update data for test attempt
  const updateFields: { [key: string]: unknown } = {
    payment_status: 'approved',
    purchased_at: new Date().toISOString(),
  };

  if (purchaseType === 'premium_report' || purchaseType === 'bundle') {
    updateFields.has_premium_access = true;
  }
  if (purchaseType === 'certificate' || purchaseType === 'bundle') {
    updateFields.has_certificate = true;
  }

  const { error: attemptError } = await supabase
    .from('test_attempts')
    .update(updateFields)
    .eq('id', attemptId);

  if (attemptError) {
    logStep("Failed to update attempt", { error: attemptError.message });
  } else {
    logStep("Access granted successfully");
  }
}
