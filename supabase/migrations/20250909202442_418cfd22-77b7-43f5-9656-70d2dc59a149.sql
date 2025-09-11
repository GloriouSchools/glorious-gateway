-- Add UPDATE policies for password changes

-- Allow students to update their own password
CREATE POLICY "Students can update their own password" 
ON public.students 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow teachers to update their own password  
CREATE POLICY "Teachers can update their own password" 
ON public.teachers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Allow admins to update their own password
CREATE POLICY "Admins can update their own password" 
ON public.admins 
FOR UPDATE 
USING (true)
WITH CHECK (true);