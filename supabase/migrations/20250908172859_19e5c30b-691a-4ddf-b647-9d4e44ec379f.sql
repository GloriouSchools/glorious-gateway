-- Add RLS policies for students table
CREATE POLICY "Students can view their own record" 
ON public.students 
FOR SELECT 
USING ((auth.uid())::text = id);

CREATE POLICY "Students can update their own record" 
ON public.students 
FOR UPDATE 
USING ((auth.uid())::text = id);

CREATE POLICY "Admins can manage all students" 
ON public.students 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));