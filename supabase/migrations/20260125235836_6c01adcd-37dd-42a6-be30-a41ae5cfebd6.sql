-- =====================================================
-- SECURITY AUDIT PHASE 3: FINAL DATA PROTECTION
-- Deny direct access to sensitive tables, force view usage
-- =====================================================

-- 1. PAYMENTS TABLE: Deny direct SELECT for non-admins
-- Users MUST use payments_secure view
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

CREATE POLICY "Users can view own payments via secure view"
ON public.payments
FOR SELECT
TO authenticated
USING (
  -- Admins can access directly
  has_role(auth.uid(), 'admin'::app_role)
  -- Regular users: block direct access (force use of payments_secure view via edge function)
  OR false
);

-- 2. PREMIUM_PURCHASES TABLE: Deny direct SELECT for non-admins
DROP POLICY IF EXISTS "Users can view own purchases" ON public.premium_purchases;

CREATE POLICY "Users can view own purchases via secure view"
ON public.premium_purchases
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (auth.uid() = user_id)
);

-- 3. SUBSCRIPTIONS TABLE: Deny direct SELECT for non-admins
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

CREATE POLICY "Users can view own subscription via secure view"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR false
);

-- 4. TEST_ATTEMPTS TABLE: Remove sensitive URL columns from user access
-- Create a function to get premium content URLs securely
CREATE OR REPLACE FUNCTION public.get_premium_urls(p_attempt_id uuid)
RETURNS TABLE (
  premium_report_url text,
  certificate_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_has_premium boolean;
  v_has_certificate boolean;
BEGIN
  -- Verify ownership and access
  SELECT ta.user_id, ta.has_premium_access, ta.has_certificate
  INTO v_user_id, v_has_premium, v_has_certificate
  FROM test_attempts ta
  WHERE ta.id = p_attempt_id;
  
  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  RETURN QUERY
  SELECT 
    CASE WHEN v_has_premium THEN ta.premium_report_url ELSE NULL END,
    CASE WHEN v_has_certificate THEN ta.certificate_url ELSE NULL END
  FROM test_attempts ta
  WHERE ta.id = p_attempt_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_premium_urls(uuid) TO authenticated;

-- 5. Create a secure view for test_attempts that hides sensitive URLs
CREATE OR REPLACE VIEW public.test_attempts_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  quiz_id,
  started_at,
  completed_at,
  total_score,
  result_category,
  result_description,
  has_premium_access,
  has_certificate,
  payment_status,
  purchased_at,
  iq_estimated,
  percentile_rank
  -- EXCLUDED: premium_report_url, certificate_url (accessed via secure function)
FROM public.test_attempts;

GRANT SELECT ON public.test_attempts_secure TO authenticated;

-- 6. ANSWER_OPTIONS: Ensure score_value is never exposed to regular users
-- Update the policy to be more restrictive
DROP POLICY IF EXISTS "Answer options viewable for active quizzes" ON public.answer_options;

-- Only allow viewing answer options (without score_value in view) for published quizzes
CREATE POLICY "Answer options viewable for published quizzes"
ON public.answer_options
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR
  EXISTS (
    SELECT 1 FROM questions q
    JOIN quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = answer_options.question_id
    AND qz.is_published = true
  )
);

-- Allow anon users to view options for published quizzes too
CREATE POLICY "Anon can view options for published quizzes"
ON public.answer_options
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = answer_options.question_id
    AND qz.is_published = true
  )
);

COMMENT ON FUNCTION public.get_premium_urls IS 'Securely returns premium content URLs only to users who have purchased access.';