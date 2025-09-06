-- Enable RLS on admin_profiles table
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin_profiles
CREATE POLICY "Admin profiles are not directly accessible" ON public.admin_profiles
AS RESTRICTIVE FOR ALL
USING (false);