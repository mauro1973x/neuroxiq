-- Add iq_estimated field to test_attempts for calculating IQ from score
ALTER TABLE public.test_attempts 
ADD COLUMN IF NOT EXISTS iq_estimated integer,
ADD COLUMN IF NOT EXISTS percentile_rank integer,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS premium_report_url text,
ADD COLUMN IF NOT EXISTS certificate_url text,
ADD COLUMN IF NOT EXISTS purchased_at timestamp with time zone;

-- Create a table to track premium purchases
CREATE TABLE IF NOT EXISTS public.premium_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  attempt_id uuid REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  purchase_type text NOT NULL, -- 'premium_report', 'certificate', 'bundle'
  amount numeric NOT NULL,
  currency text DEFAULT 'BRL',
  payment_method text, -- 'pix', 'card'
  payment_status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  pix_qr_code text,
  pix_copy_paste text,
  pix_expires_at timestamp with time zone,
  report_generated_at timestamp with time zone,
  certificate_generated_at timestamp with time zone,
  email_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on premium_purchases
ALTER TABLE public.premium_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for premium_purchases
CREATE POLICY "Users can view own purchases" 
ON public.premium_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases" 
ON public.premium_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" 
ON public.premium_purchases 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can update purchases" 
ON public.premium_purchases 
FOR UPDATE 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_premium_purchases_updated_at
BEFORE UPDATE ON public.premium_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create IQ result bands reference table
CREATE TABLE IF NOT EXISTS public.iq_result_bands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_order integer NOT NULL,
  name text NOT NULL,
  min_score integer NOT NULL,
  max_score integer NOT NULL,
  iq_min integer NOT NULL,
  iq_max integer NOT NULL,
  percentile_min integer NOT NULL,
  percentile_max integer NOT NULL,
  free_description text NOT NULL,
  premium_description text NOT NULL,
  strengths text[],
  challenges text[],
  recommendations text[],
  career_areas text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on iq_result_bands
ALTER TABLE public.iq_result_bands ENABLE ROW LEVEL SECURITY;

-- Everyone can read result bands
CREATE POLICY "Result bands are publicly readable" 
ON public.iq_result_bands 
FOR SELECT 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage result bands" 
ON public.iq_result_bands 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));