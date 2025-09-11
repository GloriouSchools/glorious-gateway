-- Fix overly restrictive RLS policies to allow users to update their own data

-- Drop the existing overly restrictive policies that prevent updates
DROP POLICY IF EXISTS "Admins can update their own password" ON public.admins;
DROP POLICY IF EXISTS "Teachers can update their own password" ON public.teachers;  
DROP POLICY IF EXISTS "Students can update their own password" ON public.students;

-- Create proper policies that allow users to update their own password and personal email
CREATE POLICY "Admins can update own data" 
ON public.admins 
FOR UPDATE 
USING ((auth.uid())::text = id)
WITH CHECK ((auth.uid())::text = id);

CREATE POLICY "Teachers can update own data" 
ON public.teachers 
FOR UPDATE 
USING ((auth.uid())::text = id)
WITH CHECK ((auth.uid())::text = id);

CREATE POLICY "Students can update own data" 
ON public.students 
FOR UPDATE 
USING ((auth.uid())::text = id)
WITH CHECK ((auth.uid())::text = id);

-- Also ensure admins can update any user's data for admin functions
CREATE POLICY "Admins can update any admin data" 
ON public.admins 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE id = (auth.uid())::text
));

CREATE POLICY "Admins can update any teacher data" 
ON public.teachers 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE id = (auth.uid())::text
));

CREATE POLICY "Admins can update any student data" 
ON public.students 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE id = (auth.uid())::text
));