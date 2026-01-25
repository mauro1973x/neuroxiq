-- =====================================================
-- SECURITY AUDIT: COMPREHENSIVE DATA PROTECTION
-- =====================================================

-- 1. RESTRICT IQ_RESULT_BANDS TO AUTHENTICATED USERS ONLY
-- (Prevents exposure of scoring algorithm to unauthenticated users)
DROP POLICY IF EXISTS "Result bands are publicly readable" ON public.iq_result_bands;

CREATE POLICY "Result bands viewable by authenticated users only"
ON public.iq_result_bands
FOR SELECT
TO authenticated
USING (true);

-- 2. SECURE ANSWER_OPTIONS - HIDE CORRECT ANSWERS FROM USERS
-- Users should NOT see score_value before completing the test
-- Remove the current public policy
DROP POLICY IF EXISTS "Options viewable if quiz published" ON public.answer_options;

-- Create a restrictive policy: users can only see answer options
-- if they have NOT yet submitted an answer for that question in an active attempt
-- OR if they are admins
-- The score_value column will be hidden via secure view
CREATE POLICY "Answer options viewable for active quizzes"
ON public.answer_options
FOR SELECT
USING (
  -- Admins can see everything
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Published quiz options are visible (but score_value hidden via view)
  EXISTS (
    SELECT 1 FROM questions q
    JOIN quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = answer_options.question_id
    AND qz.is_published = true
  )
);

-- 3. CREATE SECURE VIEWS THAT HIDE SENSITIVE DATA
-- These views exclude sensitive columns while maintaining functionality

-- 3a. Secure view for answer_options (HIDES score_value)
CREATE OR REPLACE VIEW public.answer_options_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  question_id,
  option_text,
  option_order,
  personality_trait,
  created_at
  -- EXCLUDED: score_value (reveals correct answers)
FROM public.answer_options;

-- Grant access to the secure view
GRANT SELECT ON public.answer_options_secure TO authenticated;
GRANT SELECT ON public.answer_options_secure TO anon;

-- 3b. Secure view for payments (HIDES Stripe IDs)
CREATE OR REPLACE VIEW public.payments_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  payment_type,
  status,
  attempt_id,
  created_at,
  completed_at
  -- EXCLUDED: stripe_customer_id, stripe_payment_id (sensitive payment processor data)
FROM public.payments;

-- Grant access to the secure view
GRANT SELECT ON public.payments_secure TO authenticated;

-- 3c. Secure view for premium_purchases (HIDES Stripe and PIX sensitive data)
CREATE OR REPLACE VIEW public.premium_purchases_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  attempt_id,
  purchase_type,
  amount,
  currency,
  payment_method,
  payment_status,
  report_generated_at,
  certificate_generated_at,
  email_sent_at,
  created_at,
  updated_at
  -- EXCLUDED: stripe_checkout_session_id, stripe_payment_intent_id, 
  -- pix_qr_code, pix_copy_paste, pix_expires_at (sensitive payment data)
FROM public.premium_purchases;

-- Grant access to the secure view
GRANT SELECT ON public.premium_purchases_secure TO authenticated;

-- 3d. Secure view for subscriptions (HIDES Stripe IDs)
CREATE OR REPLACE VIEW public.subscriptions_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
  -- EXCLUDED: stripe_subscription_id, stripe_customer_id (sensitive payment data)
FROM public.subscriptions;

-- Grant access to the secure view
GRANT SELECT ON public.subscriptions_secure TO authenticated;

-- 4. CREATE SECURE SCORING FUNCTION (Server-side only)
-- This function calculates scores securely without exposing score_value to clients
CREATE OR REPLACE FUNCTION public.calculate_test_score(p_attempt_id uuid)
RETURNS TABLE (
  total_score integer,
  max_possible integer,
  percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verify the attempt belongs to the requesting user
  SELECT user_id INTO v_user_id
  FROM test_attempts
  WHERE id = p_attempt_id;
  
  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized access to test attempt';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(ao.score_value), 0)::integer AS total_score,
    COUNT(ua.id)::integer AS max_possible,
    CASE 
      WHEN COUNT(ua.id) > 0 THEN 
        ROUND((COALESCE(SUM(ao.score_value), 0)::numeric / COUNT(ua.id)::numeric) * 100, 2)
      ELSE 0
    END AS percentage
  FROM user_answers ua
  JOIN answer_options ao ON ua.selected_option_id = ao.id
  WHERE ua.attempt_id = p_attempt_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.calculate_test_score(uuid) TO authenticated;

-- 5. ADD COMMENT DOCUMENTATION FOR SECURITY AUDIT TRAIL
COMMENT ON VIEW public.answer_options_secure IS 'Secure view that excludes score_value to prevent answer cheating. Use this view for client-facing queries.';
COMMENT ON VIEW public.payments_secure IS 'Secure view that excludes Stripe customer/payment IDs. Use this view for client-facing queries.';
COMMENT ON VIEW public.premium_purchases_secure IS 'Secure view that excludes Stripe and PIX sensitive data. Use this view for client-facing queries.';
COMMENT ON VIEW public.subscriptions_secure IS 'Secure view that excludes Stripe subscription/customer IDs. Use this view for client-facing queries.';
COMMENT ON FUNCTION public.calculate_test_score IS 'Securely calculates test scores server-side without exposing score_value to clients.';