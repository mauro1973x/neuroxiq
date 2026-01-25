-- Remove the public SELECT policy that exposes user profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new SELECT policy that restricts access to own profile only
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: The existing INSERT and UPDATE policies already correctly use (auth.uid() = user_id)
-- so they remain unchanged