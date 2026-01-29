-- Fix: Drop the overly permissive policy and create proper restricted policies
DROP POLICY IF EXISTS "Service can manage payment events" ON public.payment_events;

-- Only service role can insert (webhooks/edge functions bypass RLS with service_role key)
-- Admins can view for audit purposes (already exists)
-- No direct user access needed - this is an internal audit table