-- Drop the authenticated-only UPDATE policies 
DROP POLICY IF EXISTS "Allow authenticated users to update students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated users to update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow authenticated users to update admins" ON public.admins;

-- Create UPDATE policies that work with both anon and authenticated users
-- This is needed since the app uses custom authentication
CREATE POLICY "Allow update access to students" 
ON public.students 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow update access to teachers"
ON public.teachers
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow update access to admins"
ON public.admins
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);