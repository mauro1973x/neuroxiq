-- Create payment_events table for audit logging and idempotency
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  checkout_session_id TEXT,
  payment_intent_id TEXT,
  user_id UUID,
  attempt_id UUID REFERENCES public.test_attempts(id),
  payload_summary JSONB,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookup by stripe_event_id (idempotency check)
CREATE INDEX idx_payment_events_stripe_event_id ON public.payment_events(stripe_event_id);
CREATE INDEX idx_payment_events_checkout_session ON public.payment_events(checkout_session_id);
CREATE INDEX idx_payment_events_user_id ON public.payment_events(user_id);

-- Enable RLS
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view payment events (audit log)
CREATE POLICY "Admins can view all payment events"
  ON public.payment_events
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System/service role can insert and update (webhooks)
CREATE POLICY "Service can manage payment events"
  ON public.payment_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add premium_unlocked_at column to test_attempts if not exists
ALTER TABLE public.test_attempts 
  ADD COLUMN IF NOT EXISTS premium_unlocked_at TIMESTAMP WITH TIME ZONE;