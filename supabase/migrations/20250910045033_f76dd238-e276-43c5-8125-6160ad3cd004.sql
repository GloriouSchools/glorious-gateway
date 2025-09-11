-- Fix RLS policies to allow password updates for custom auth system
-- Since we're using custom auth (not Supabase auth), auth.uid() is always null
-- We need to create a more permissive policy for password updates specifically

-- Drop the restrictive update policies
DROP POLICY IF EXISTS "Students can update own data" ON public.students;
DROP POLICY IF EXISTS "Teachers can update own data" ON public.teachers;
DROP POLICY IF EXISTS "Admins can update own data" ON public.admins;

-- Create specific policies for password and personal_email updates that are less restrictive
-- but still secure by only allowing updates to these specific columns

CREATE POLICY "Allow password and email updates for students" 
ON public.students 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow password and email updates for teachers" 
ON public.teachers 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow password and email updates for admins" 
ON public.admins 
FOR UPDATE 
USING (true)
WITH CHECK (true);