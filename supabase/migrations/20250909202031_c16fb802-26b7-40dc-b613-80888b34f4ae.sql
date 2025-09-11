-- Fix RLS policies to allow proper data access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow read access to students" ON public.students;
DROP POLICY IF EXISTS "Allow read access to teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow read access to classes" ON public.classes;
DROP POLICY IF EXISTS "Allow read access to streams" ON public.streams;

-- Create proper RLS policies for students
CREATE POLICY "Students can read all student data" 
ON public.students 
FOR SELECT 
USING (true);

-- Create proper RLS policies for teachers
CREATE POLICY "Teachers can read all teacher data" 
ON public.teachers 
FOR SELECT 
USING (true);

-- Create proper RLS policies for classes
CREATE POLICY "Everyone can read classes" 
ON public.classes 
FOR SELECT 
USING (true);

-- Create proper RLS policies for streams
CREATE POLICY "Everyone can read streams" 
ON public.streams 
FOR SELECT 
USING (true);

-- Create policies for admins table (if needed)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all admin data" 
ON public.admins 
FOR SELECT 
USING (true);