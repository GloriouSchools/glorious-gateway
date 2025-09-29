-- Drop the existing UPDATE policies that require Supabase auth
DROP POLICY IF EXISTS "Students can update their own data" ON public.students;
DROP POLICY IF EXISTS "Teachers can update their own data" ON public.teachers;
DROP POLICY IF EXISTS "Admins can update their own data" ON public.admins;

-- Create new UPDATE policies that allow authenticated users to update any record
-- This is needed since the app uses custom authentication, not Supabase auth
CREATE POLICY "Allow authenticated users to update students" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update teachers"
ON public.teachers
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update admins"
ON public.admins
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);