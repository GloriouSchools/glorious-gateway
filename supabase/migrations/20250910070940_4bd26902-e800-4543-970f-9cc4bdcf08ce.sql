-- Enable RLS on all remaining tables that need it
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins
CREATE POLICY "Admins can view their own data" 
ON public.admins 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Admins can update their own data" 
ON public.admins 
FOR UPDATE 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create RLS policies for students
CREATE POLICY "Students can view their own data" 
ON public.students 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Students can update their own data" 
ON public.students 
FOR UPDATE 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create RLS policies for classes (read-only for authenticated users)
CREATE POLICY "Authenticated users can view classes" 
ON public.classes 
FOR SELECT 
TO authenticated
USING (true);

-- Create RLS policies for streams (read-only for authenticated users)
CREATE POLICY "Authenticated users can view streams" 
ON public.streams 
FOR SELECT 
TO authenticated
USING (true);