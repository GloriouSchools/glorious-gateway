-- Disable RLS on all existing tables
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.streams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can manage all data" ON public.admins;
DROP POLICY IF EXISTS "Students can view their own data" ON public.students;
DROP POLICY IF EXISTS "Students can update their own data" ON public.students;
DROP POLICY IF EXISTS "Teachers can view their own data" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update their own data" ON public.teachers;
DROP POLICY IF EXISTS "Anyone can view classes" ON public.classes;
DROP POLICY IF EXISTS "Anyone can view streams" ON public.streams;

-- Create electoral applications table
CREATE TABLE public.electoral_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_photo TEXT,
  class_name TEXT NOT NULL,
  stream_name TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  why_apply TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create electoral votes table
CREATE TABLE public.electoral_votes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id TEXT NOT NULL,
  voter_name TEXT,
  voter_email TEXT,
  position TEXT NOT NULL,
  candidate_id TEXT NOT NULL REFERENCES public.electoral_applications(id),
  candidate_name TEXT NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(voter_id, position)
);

-- Create electoral positions table for configuration
CREATE TABLE public.electoral_positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default electoral positions
INSERT INTO public.electoral_positions (id, title, description) VALUES
('head_prefect', 'HEAD PREFECT', 'Lead the entire student body and represent students to school administration'),
('academic_prefect', 'ACADEMIC PREFECT', 'Oversee academic activities and support student learning initiatives'),
('head_monitors', 'HEAD MONITOR(ES)', 'Coordinate monitor activities and maintain school discipline'),
('welfare_prefect', 'WELFARE PREFECT (MESS PREFECT)', 'Manage student welfare and dining hall operations'),
('entertainment_prefect', 'ENTERTAINMENT PREFECT', 'Organize school events and entertainment activities'),
('games_sports_prefect', 'GAMES AND SPORTS PREFECT', 'Coordinate sports activities and represent the school in competitions'),
('health_sanitation', 'HEALTH & SANITATION', 'Maintain school hygiene and promote health awareness'),
('uniform_uniformity', 'UNIFORM & UNIFORMITY', 'Ensure proper school uniform standards and dress code compliance'),
('time_keeper', 'TIME KEEPER', 'Manage school schedules and ensure punctuality'),
('ict_prefect', 'ICT PREFECT', 'Support technology use and digital learning initiatives');

-- Create triggers for updated_at columns
CREATE TRIGGER update_electoral_applications_updated_at
  BEFORE UPDATE ON public.electoral_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_electoral_positions_updated_at
  BEFORE UPDATE ON public.electoral_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();