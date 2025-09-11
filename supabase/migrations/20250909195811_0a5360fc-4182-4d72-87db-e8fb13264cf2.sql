-- Enable RLS policies to allow proper data access
-- Allow authenticated users to read all students data (for admin dashboard)
CREATE POLICY "Allow read access to students" ON public.students
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to read all teachers data (for admin dashboard)  
CREATE POLICY "Allow read access to teachers" ON public.teachers
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to read all classes data
CREATE POLICY "Allow read access to classes" ON public.classes
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to read all streams data
CREATE POLICY "Allow read access to streams" ON public.streams
FOR SELECT TO authenticated
USING (true);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;