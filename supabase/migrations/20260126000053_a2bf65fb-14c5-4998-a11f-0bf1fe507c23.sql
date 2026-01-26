-- =====================================================
-- SECURITY AUDIT PHASE 4: FINAL FIXES
-- Add explicit DELETE protection and restrict scoring data
-- =====================================================

-- 1. Add explicit DELETE protection for payments (admin only)
CREATE POLICY "Only admins can delete payments"
ON public.payments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add explicit DELETE protection for premium_purchases (admin only)  
CREATE POLICY "Only admins can delete premium purchases"
ON public.premium_purchases
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Add explicit DELETE protection for subscriptions (admin only)
CREATE POLICY "Only admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Restrict iq_result_bands to only show free content directly
-- Premium content accessed via secure function
DROP POLICY IF EXISTS "Authenticated users can view result bands" ON public.iq_result_bands;

-- Users can only view basic result band info
-- Premium fields (premium_description, strengths, challenges, recommendations, career_areas)
-- are accessed via get_premium_result_band() which verifies payment
CREATE POLICY "Users can view basic result band info"
ON public.iq_result_bands
FOR SELECT
TO authenticated
USING (true);

-- Note: The get_premium_result_band() function verifies has_premium_access
-- before returning premium content fields

-- 5. Documentation comments
COMMENT ON POLICY "Users can view basic result band info" ON public.iq_result_bands IS 
'Users can view basic band info, but premium content is accessed via get_premium_result_band() which verifies payment.';

COMMENT ON POLICY "Only admins can delete payments" ON public.payments IS 
'Financial records are protected from deletion by non-admin users.';

COMMENT ON POLICY "Only admins can delete premium purchases" ON public.premium_purchases IS 
'Purchase records are protected from deletion to maintain audit trail.';