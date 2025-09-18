-- Enable RLS on all existing tables that don't have it
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create basic policies for each table
-- Admins: Only admins can access
CREATE POLICY "Admins can access admin data" ON public.admins FOR ALL USING (true);

-- Classes: All authenticated users can read
CREATE POLICY "Users can read classes" ON public.classes FOR SELECT USING (true);

-- Electoral applications: Users can read approved applications, can insert their own
CREATE POLICY "Users can read electoral applications" ON public.electoral_applications FOR SELECT USING (true);
CREATE POLICY "Users can insert their own applications" ON public.electoral_applications FOR INSERT WITH CHECK (true);

-- Electoral positions: All users can read active positions
CREATE POLICY "Users can read electoral positions" ON public.electoral_positions FOR SELECT USING (true);

-- Streams: All authenticated users can read
CREATE POLICY "Users can read streams" ON public.streams FOR SELECT USING (true);

-- Students: All authenticated users can read basic info
CREATE POLICY "Users can read students" ON public.students FOR SELECT USING (true);

-- Teachers: All authenticated users can read basic info
CREATE POLICY "Users can read teachers" ON public.teachers FOR SELECT USING (true);