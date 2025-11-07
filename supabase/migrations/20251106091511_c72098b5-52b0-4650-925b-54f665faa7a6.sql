-- Add DELETE policy for electoral_applications table
CREATE POLICY "Allow delete for electoral_applications" 
ON public.electoral_applications
FOR DELETE
USING (true);