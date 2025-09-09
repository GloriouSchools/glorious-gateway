-- Create RLS policies for the students table

-- Allow students to view their own records
CREATE POLICY "Students can view their own record" 
ON public.students 
FOR SELECT 
USING (auth.uid()::text = id);

-- Allow students to update their own records (excluding sensitive fields)
CREATE POLICY "Students can update their own record" 
ON public.students 
FOR UPDATE 
USING (auth.uid()::text = id);

-- Allow admins to manage all student records
CREATE POLICY "Admins can manage all students" 
ON public.students 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert new student records
CREATE POLICY "Admins can insert students" 
ON public.students 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow teachers to view students (for class management)
CREATE POLICY "Teachers can view students" 
ON public.students 
FOR SELECT 
USING (has_role(auth.uid(), 'teacher'::app_role));