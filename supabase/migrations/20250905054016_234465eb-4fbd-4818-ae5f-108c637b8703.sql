-- Revert student table policies to allow public access
-- Drop the restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
DROP POLICY IF EXISTS "Students can view their own record" ON public.students;

-- Recreate the original public access policy
CREATE POLICY "Students are viewable by everyone" 
ON public.students 
FOR SELECT 
USING (true);

-- Also ensure teachers remain publicly viewable
DROP POLICY IF EXISTS "Authenticated users can view teachers" ON public.teachers;

CREATE POLICY "Teachers are viewable by everyone" 
ON public.teachers 
FOR SELECT 
USING (true);