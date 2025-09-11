-- Create the main tables for the school management system

-- Create admins table
CREATE TABLE public.admins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  personal_email TEXT,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create streams table
CREATE TABLE public.streams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  class_id TEXT REFERENCES public.classes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  personal_email TEXT,
  password_hash TEXT NOT NULL,
  class_id TEXT REFERENCES public.classes(id),
  stream_id TEXT REFERENCES public.streams(id),
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  teacher_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  personal_email TEXT,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you'll need to customize these based on your needs)
-- Admins can see everything
CREATE POLICY "Admins can view all admins" ON public.admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view all classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view all streams" ON public.streams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view all students" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view all teachers" ON public.teachers FOR SELECT TO authenticated USING (true);

-- Students can view their own data
CREATE POLICY "Students can view own data" ON public.students FOR SELECT TO authenticated USING (id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Students can update own data" ON public.students FOR UPDATE TO authenticated USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Teachers can view their own data
CREATE POLICY "Teachers can view own data" ON public.teachers FOR SELECT TO authenticated USING (id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "Teachers can update own data" ON public.teachers FOR UPDATE TO authenticated USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Everyone can view classes and streams (for dropdowns, etc.)
CREATE POLICY "Everyone can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Everyone can view streams" ON public.streams FOR SELECT TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_streams_updated_at BEFORE UPDATE ON public.streams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();