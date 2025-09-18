-- Enable Row Level Security on all electoral tables
ALTER TABLE public.electoral_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_positions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.electoral_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for electoral_applications (students can only see/edit their own)
CREATE POLICY "Students can view own applications" 
ON public.electoral_applications FOR SELECT 
USING (student_id = auth.uid()::text);

CREATE POLICY "Students can create own applications" 
ON public.electoral_applications FOR INSERT 
WITH CHECK (student_id = auth.uid()::text);

CREATE POLICY "Students can update own applications" 
ON public.electoral_applications FOR UPDATE 
USING (student_id = auth.uid()::text);

-- RLS Policies for electoral_positions (read-only for all authenticated users)
CREATE POLICY "Anyone can view active positions" 
ON public.electoral_positions FOR SELECT 
USING (auth.role() = 'authenticated');

-- RLS Policies for electoral_votes (students can only see own votes, create their own)
CREATE POLICY "Students can view own votes" 
ON public.electoral_votes FOR SELECT 
USING (voter_id = auth.uid()::text);

CREATE POLICY "Students can create own votes" 
ON public.electoral_votes FOR INSERT 
WITH CHECK (voter_id = auth.uid()::text);

-- Basic RLS policies for other tables (can be refined later)
CREATE POLICY "Students can view own profile" 
ON public.students FOR SELECT 
USING (id = auth.uid()::text);

CREATE POLICY "Teachers can view own profile" 
ON public.teachers FOR SELECT 
USING (id = auth.uid()::text);

CREATE POLICY "Admins can view own profile" 
ON public.admins FOR SELECT 
USING (id = auth.uid()::text);

CREATE POLICY "Anyone can view classes" 
ON public.classes FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view streams" 
ON public.streams FOR SELECT 
USING (auth.role() = 'authenticated');