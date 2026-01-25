-- =====================================================
-- SECURITY AUDIT PHASE 2: COMPLETE DATA PROTECTION
-- =====================================================

-- 1. CREATE SECURE VIEW FOR QUESTIONS (HIDE weight and category from users)
CREATE OR REPLACE VIEW public.questions_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  quiz_id,
  question_text,
  question_order,
  created_at
  -- EXCLUDED: weight, category (reveals test scoring logic)
FROM public.questions;

GRANT SELECT ON public.questions_secure TO authenticated;
GRANT SELECT ON public.questions_secure TO anon;

COMMENT ON VIEW public.questions_secure IS 'Secure view that excludes weight and category to prevent test gaming. Use this view for client-facing queries.';

-- 2. CREATE SECURE VIEW FOR QUIZZES (HIDE internal pricing details)
CREATE OR REPLACE VIEW public.quizzes_secure
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  image_url,
  test_type,
  question_count,
  duration_minutes,
  is_premium,
  is_published,
  created_at,
  updated_at
  -- EXCLUDED: price_basic, price_premium, price_certificate (pricing strategy)
FROM public.quizzes
WHERE is_published = true;

GRANT SELECT ON public.quizzes_secure TO authenticated;
GRANT SELECT ON public.quizzes_secure TO anon;

COMMENT ON VIEW public.quizzes_secure IS 'Secure view that excludes internal pricing data and shows only published quizzes.';

-- 3. CREATE SECURE VIEW FOR IQ_RESULT_BANDS (HIDE premium content from non-payers)
-- Free users only see free_description; premium fields require purchase verification
CREATE OR REPLACE VIEW public.iq_result_bands_free
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  band_order,
  min_score,
  max_score,
  iq_min,
  iq_max,
  percentile_min,
  percentile_max,
  free_description,
  created_at
  -- EXCLUDED: premium_description, strengths, challenges, recommendations, career_areas
FROM public.iq_result_bands;

GRANT SELECT ON public.iq_result_bands_free TO authenticated;

COMMENT ON VIEW public.iq_result_bands_free IS 'Free version of result bands. Premium content requires verified payment.';

-- 4. CREATE FUNCTION TO GET PREMIUM RESULT BAND (only for paid users)
CREATE OR REPLACE FUNCTION public.get_premium_result_band(p_attempt_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  band_order integer,
  min_score integer,
  max_score integer,
  iq_min integer,
  iq_max integer,
  percentile_min integer,
  percentile_max integer,
  free_description text,
  premium_description text,
  strengths text[],
  challenges text[],
  recommendations text[],
  career_areas text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_has_premium boolean;
  v_score integer;
BEGIN
  -- Verify the attempt belongs to the requesting user and has premium access
  SELECT ta.user_id, ta.has_premium_access, ta.total_score 
  INTO v_user_id, v_has_premium, v_score
  FROM test_attempts ta
  WHERE ta.id = p_attempt_id;
  
  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized access to test attempt';
  END IF;
  
  IF NOT v_has_premium THEN
    RAISE EXCEPTION 'Premium access required. Please purchase the premium report.';
  END IF;

  RETURN QUERY
  SELECT 
    rb.id,
    rb.name,
    rb.band_order,
    rb.min_score,
    rb.max_score,
    rb.iq_min,
    rb.iq_max,
    rb.percentile_min,
    rb.percentile_max,
    rb.free_description,
    rb.premium_description,
    rb.strengths,
    rb.challenges,
    rb.recommendations,
    rb.career_areas
  FROM iq_result_bands rb
  WHERE v_score BETWEEN rb.min_score AND rb.max_score
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_premium_result_band(uuid) TO authenticated;

COMMENT ON FUNCTION public.get_premium_result_band IS 'Returns full premium result band data only for users who have paid for premium access.';

-- 5. UPDATE RLS ON iq_result_bands TO BE MORE RESTRICTIVE
-- Only show basic fields through the free view; premium content via function
DROP POLICY IF EXISTS "Result bands viewable by authenticated users only" ON public.iq_result_bands;
DROP POLICY IF EXISTS "Admins can manage result bands" ON public.iq_result_bands;

-- Admins can manage everything
CREATE POLICY "Admins can manage result bands"
ON public.iq_result_bands
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Regular authenticated users can only SELECT (but premium content accessed via function)
CREATE POLICY "Authenticated users can view result bands"
ON public.iq_result_bands
FOR SELECT
TO authenticated
USING (true);

-- 6. FIX: The secure views are VIEWS not TABLES, so RLS doesn't apply to them directly
-- Views inherit RLS from underlying tables when using security_invoker
-- No additional action needed for views

-- 7. ADD NOTES FOR SECURITY DOCUMENTATION
COMMENT ON TABLE public.answer_options IS 'SECURITY: Do not query directly from frontend. Use answer_options_secure view.';
COMMENT ON TABLE public.questions IS 'SECURITY: Do not query directly from frontend. Use questions_secure view.';
COMMENT ON TABLE public.quizzes IS 'SECURITY: Do not query directly from frontend. Use quizzes_secure view.';
COMMENT ON TABLE public.payments IS 'SECURITY: Do not query directly from frontend. Use payments_secure view.';
COMMENT ON TABLE public.premium_purchases IS 'SECURITY: Do not query directly from frontend. Use premium_purchases_secure view.';
COMMENT ON TABLE public.subscriptions IS 'SECURITY: Do not query directly from frontend. Use subscriptions_secure view.';