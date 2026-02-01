import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  // deno-lint-ignore no-explicit-any
  const supabase: any = createClient(supabaseUrl, supabaseKey);

  try {
    logStep("Webhook received");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // SECURITY: Webhook signature verification is REQUIRED
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      logStep("CRITICAL: STRIPE_WEBHOOK_SECRET not configured - rejecting request");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }), 
        { status: 500 }
      );
    }

    if (!signature) {
      logStep("Missing stripe-signature header - rejecting request");
      return new Response(
        JSON.stringify({ error: "Missing signature" }), 
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logStep("Webhook signature verification failed", { error: message });
      return new Response(JSON.stringify({ error: message }), { status: 400 });
    }

    logStep("Event received", { type: event.type, eventId: event.id, livemode: event.livemode });

    // SECURITY: In LIVE mode, only process LIVE events
    // This prevents test card payments from unlocking content in production
    const isProduction = Deno.env.get("STRIPE_SECRET_KEY")?.startsWith("sk_live");
    if (isProduction && !event.livemode) {
      logStep("SECURITY: Rejecting test mode event in production", { 
        eventId: event.id, 
        livemode: event.livemode,
        isProduction: true
      });
      
      // Log this rejection for audit
      await supabase
        .from('payment_events')
        .insert({
          stripe_event_id: event.id,
          event_type: `REJECTED_TEST_EVENT_${event.type}`,
          payload_summary: {
            reason: 'Test mode event rejected in production',
            livemode: event.livemode,
            type: event.type,
          },
          processed: true,
          processed_at: new Date().toISOString(),
          error: 'Test mode event rejected in production'
        });

      return new Response(JSON.stringify({ 
        received: true, 
        rejected: true,
        reason: "Test mode events not processed in production"
      }), { status: 200 });
    }

    // IDEMPOTENCY CHECK: Check if this event was already processed
    const { data: existingEvent } = await supabase
      .from('payment_events')
      .select('id, processed')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingEvent?.processed) {
      logStep("Event already processed, skipping", { eventId: event.id });
      return new Response(JSON.stringify({ received: true, skipped: true }), { status: 200 });
    }

    // Log the event before processing
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const { error: insertError } = await supabase
      .from('payment_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        checkout_session_id: sessionObj?.id || null,
        payment_intent_id: sessionObj?.payment_intent as string || null,
        user_id: sessionObj?.metadata?.user_id || null,
        attempt_id: sessionObj?.metadata?.attempt_id || null,
        payload_summary: {
          type: event.type,
          created: event.created,
          livemode: event.livemode,
          payment_status: sessionObj?.payment_status || null,
        },
        processed: false,
      });

    if (insertError && !insertError.message?.includes('duplicate')) {
      logStep("Warning: Failed to log event", { error: insertError.message });
    }

    let processError: string | null = null;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id, 
          paymentStatus: session.payment_status,
          livemode: session.livemode
        });

        // ONLY unlock if payment_status is 'paid' AND event is livemode (in production)
        if (session.payment_status === 'paid') {
          await handleSuccessfulPayment(supabase, session, event.id, event.livemode);
        } else {
          logStep("Payment status not 'paid', skipping unlock", { 
            paymentStatus: session.payment_status 
          });
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        // For PIX payments that complete asynchronously
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Async payment succeeded (PIX)", { sessionId: session.id, livemode: session.livemode });
        await handleSuccessfulPayment(supabase, session, event.id, event.livemode);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Async payment failed", { sessionId: session.id });
        
        await supabase
          .from('premium_purchases')
          .update({ payment_status: 'rejected' })
          .eq('stripe_checkout_session_id', session.id);

        await supabase
          .from('test_attempts')
          .update({ payment_status: 'failed' })
          .eq('id', session.metadata?.attempt_id);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session expired", { sessionId: session.id });
        
        await supabase
          .from('premium_purchases')
          .update({ payment_status: 'expired' })
          .eq('stripe_checkout_session_id', session.id);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment intent succeeded", { 
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          livemode: paymentIntent.livemode
        });
        // Payment intents are typically handled via checkout.session.completed
        // but logging here for visibility
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment intent processing (async payment like PIX)", { 
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount
        });
        // This is informational - actual unlock happens on checkout.session events
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    // Mark event as processed
    await supabase
      .from('payment_events')
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString(),
        error: processError
      })
      .eq('stripe_event_id', event.id);

    logStep("Event processing completed", { eventId: event.id });
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
});

// deno-lint-ignore no-explicit-any
async function handleSuccessfulPayment(
  supabase: any,
  session: Stripe.Checkout.Session,
  eventId: string,
  livemode: boolean
) {
  const attemptId = session.metadata?.attempt_id;
  const userId = session.metadata?.user_id;
  const purchaseType = session.metadata?.purchase_type || 'premium_report';

  logStep("Processing successful payment", { attemptId, userId, purchaseType, eventId, livemode });

  if (!attemptId || !userId) {
    logStep("Missing metadata", { attemptId, userId });
    return;
  }

  // Check if already unlocked (idempotency)
  const { data: existingAttempt } = await supabase
    .from('test_attempts')
    .select('has_premium_access, has_certificate')
    .eq('id', attemptId)
    .single();

  // Build update data for test attempt based on purchase type
  const updateFields: Record<string, unknown> = {};
  
  if (purchaseType === 'premium_report' || purchaseType === 'bundle') {
    if (existingAttempt?.has_premium_access) {
      logStep("Report already unlocked, skipping", { attemptId });
    } else {
      updateFields.has_premium_access = true;
      updateFields.payment_status = 'approved';
      updateFields.purchased_at = new Date().toISOString();
      updateFields.premium_unlocked_at = new Date().toISOString();
    }
  }
  
  if (purchaseType === 'certificate' || purchaseType === 'bundle') {
    if (existingAttempt?.has_certificate) {
      logStep("Certificate already unlocked, skipping", { attemptId });
    } else {
      // Generate unique validation code
      const validationCode = 'NX-' + [...Array(10)].map(() => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
      ).join('');
      
      updateFields.has_certificate = true;
      updateFields.certificate_payment_status = 'paid';
      updateFields.certificate_issued_at = new Date().toISOString();
      updateFields.validation_code = validationCode;
      updateFields.stripe_certificate_session_id = session.id;
    }
  }

  // Only update if there are fields to update
  if (Object.keys(updateFields).length === 0) {
    logStep("No updates needed, already processed", { attemptId, purchaseType });
    return;
  }

  // Update purchase record
  await supabase
    .from('premium_purchases')
    .update({
      payment_status: 'approved',
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('stripe_checkout_session_id', session.id);

  const { error: attemptError } = await supabase
    .from('test_attempts')
    .update(updateFields)
    .eq('id', attemptId);

  if (attemptError) {
    logStep("Failed to update attempt", { error: attemptError.message });
  } else {
    logStep("Access granted successfully via webhook", { 
      attemptId, 
      eventId, 
      purchaseType, 
      livemode,
      fields: Object.keys(updateFields) 
    });
  }
}
