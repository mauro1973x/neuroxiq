-- Add certificate-specific payment fields to test_attempts
ALTER TABLE public.test_attempts 
ADD COLUMN IF NOT EXISTS test_name text,
ADD COLUMN IF NOT EXISTS score_label text DEFAULT 'Pontuação',
ADD COLUMN IF NOT EXISTS score_value text,
ADD COLUMN IF NOT EXISTS certificate_payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS validation_code text UNIQUE,
ADD COLUMN IF NOT EXISTS certificate_issued_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS stripe_certificate_session_id text;

-- Add index on validation_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_test_attempts_validation_code 
ON public.test_attempts(validation_code) WHERE validation_code IS NOT NULL;

-- Create function to generate unique validation code
CREATE OR REPLACE FUNCTION public.generate_validation_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := 'NX-';
  i integer;
BEGIN
  FOR i IN 1..10 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$function$;

-- Update RLS policies for test_attempts to allow certificate fields update
DROP POLICY IF EXISTS "Users can update own attempts" ON public.test_attempts;
CREATE POLICY "Users can update own attempts"
ON public.test_attempts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);