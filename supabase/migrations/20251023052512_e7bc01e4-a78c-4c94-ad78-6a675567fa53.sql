-- Add RLS policies to allow login queries for students, teachers, and admins tables

-- Students table policies
CREATE POLICY "Allow public read access for authentication"
ON public.students
FOR SELECT
USING (true);

-- Teachers table policies  
CREATE POLICY "Allow public read access for authentication"
ON public.teachers
FOR SELECT
USING (true);

-- Admins table policies
CREATE POLICY "Allow public read access for authentication"
ON public.admins
FOR SELECT
USING (true);