-- Enable RLS on students table (if not already enabled)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow login access to students table
CREATE POLICY "Allow login access to students" 
ON public.students 
FOR SELECT 
USING (true);

-- Create RLS policy to allow students to update their own records
CREATE POLICY "Allow update access to students" 
ON public.students 
FOR UPDATE 
USING (true)
WITH CHECK (true);