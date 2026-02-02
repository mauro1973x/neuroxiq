-- Fix the RLS policy on payments table
-- Drop the problematic policy with 'OR false' condition
DROP POLICY IF EXISTS "Users can view own payments via secure view" ON public.payments;

-- Create proper policy allowing users to view their own payments
CREATE POLICY "Users can view own payments"
ON public.payments
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));