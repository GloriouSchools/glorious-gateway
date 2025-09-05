-- Fix security issue: Remove public access to students table and implement proper access control

-- Step 1: Drop the existing public access policy
DROP POLICY IF EXISTS "Students are viewable by everyone during registration" ON public.students;

-- Step 2: Create a secure function to validate student existence during registration
-- This function only returns a boolean, not exposing any student data
CREATE OR REPLACE FUNCTION public.validate_student_exists(
  p_class_id uuid,
  p_stream_id uuid,
  p_student_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.students 
    WHERE class_id = p_class_id 
      AND stream_id = p_stream_id 
      AND name = p_student_name
  );
END;
$$;

-- Step 3: Create new RLS policies for proper access control

-- Policy 1: Authenticated users (students and teachers) can view student data
CREATE POLICY "Authenticated users can view students" 
ON public.students 
FOR SELECT 
TO authenticated
USING (true);

-- Policy 2: Students can view their own data (when linked to their profile)
-- This will be useful when we link students to their user accounts
CREATE POLICY "Students can view their own record" 
ON public.students 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.full_name = students.name
  )
);

-- Step 4: Create similar secure validation functions for teachers
CREATE OR REPLACE FUNCTION public.validate_teacher_exists(
  p_teacher_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.teachers 
    WHERE name = p_teacher_name
  );
END;
$$;

-- Step 5: Update teachers table RLS policies
DROP POLICY IF EXISTS "Teachers are viewable by everyone during registration" ON public.teachers;

-- Teachers can be viewed by authenticated users
CREATE POLICY "Authenticated users can view teachers" 
ON public.teachers 
FOR SELECT 
TO authenticated
USING (true);

-- Step 6: Grant execute permissions on validation functions to anon role for registration
GRANT EXECUTE ON FUNCTION public.validate_student_exists TO anon;
GRANT EXECUTE ON FUNCTION public.validate_teacher_exists TO anon;