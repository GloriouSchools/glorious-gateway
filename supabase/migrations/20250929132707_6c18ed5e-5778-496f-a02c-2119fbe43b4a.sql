-- Create UPDATE policies for authenticated users to update their own records

-- Policy for students to update their own data
CREATE POLICY "Students can update their own data" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (id = auth.uid()::text)
WITH CHECK (id = auth.uid()::text);

-- Policy for teachers to update their own data  
CREATE POLICY "Teachers can update their own data"
ON public.teachers
FOR UPDATE
TO authenticated
USING (id = auth.uid()::text)
WITH CHECK (id = auth.uid()::text);

-- Policy for admins to update their own data
CREATE POLICY "Admins can update their own data"
ON public.admins
FOR UPDATE
TO authenticated
USING (id = auth.uid()::text)
WITH CHECK (id = auth.uid()::text);