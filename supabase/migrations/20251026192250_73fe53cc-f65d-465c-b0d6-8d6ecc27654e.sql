-- Remove unused columns from electoral_applications table
ALTER TABLE public.electoral_applications 
DROP COLUMN IF EXISTS experience,
DROP COLUMN IF EXISTS qualifications,
DROP COLUMN IF EXISTS why_apply;

-- Ensure RLS is enabled for proper CRUD operations
ALTER TABLE public.electoral_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public to query electoral_applications" ON public.electoral_applications;

-- Create comprehensive RLS policies for electoral_applications
CREATE POLICY "Anyone can view electoral_applications"
ON public.electoral_applications
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert electoral_applications"
ON public.electoral_applications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update electoral_applications"
ON public.electoral_applications
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete electoral_applications"
ON public.electoral_applications
FOR DELETE
TO public
USING (true);