-- ============================================
-- FIX 1: payment_events RLS - Block all non-admin access
-- The table should only be written to by webhooks (service role)
-- and read by admins. No regular user access needed.
-- ============================================

-- Drop any existing overly permissive policies (if any)
DROP POLICY IF EXISTS "payment_events_public_read" ON public.payment_events;

-- Ensure RLS is enabled
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner (prevents bypassing)
ALTER TABLE public.payment_events FORCE ROW LEVEL SECURITY;

-- ============================================
-- FIX 2: profiles_public_exposure - Already has correct RLS
-- but we'll add a SECURITY DEFINER function for certificate validation
-- ============================================

-- Create a function to get certificate holder name given a validation code
-- This allows anonymous certificate validation without exposing profiles table
CREATE OR REPLACE FUNCTION public.get_certificate_holder_name(p_validation_code text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_holder_name text;
  v_has_certificate boolean;
BEGIN
  -- First verify the certificate exists and is valid
  SELECT ta.user_id, ta.has_certificate
  INTO v_user_id, v_has_certificate
  FROM test_attempts ta
  WHERE ta.validation_code = UPPER(p_validation_code)
    AND ta.has_certificate = true
    AND ta.certificate_payment_status = 'paid';
  
  -- If no valid certificate found, return null
  IF v_user_id IS NULL OR v_has_certificate IS NOT TRUE THEN
    RETURN NULL;
  END IF;
  
  -- Get the profile name for the certificate holder
  SELECT p.full_name
  INTO v_holder_name
  FROM profiles p
  WHERE p.user_id = v_user_id;
  
  -- Return the name (could be null if profile not completed)
  RETURN v_holder_name;
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_certificate_holder_name(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_certificate_holder_name(text) TO authenticated;