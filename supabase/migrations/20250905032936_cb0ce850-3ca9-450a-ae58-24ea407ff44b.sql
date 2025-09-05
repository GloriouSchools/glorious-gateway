-- Create tables for school structure
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, name)
);

CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.teacher_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read for registration
CREATE POLICY "Classes are viewable by everyone" 
ON public.classes FOR SELECT 
USING (true);

CREATE POLICY "Streams are viewable by everyone" 
ON public.streams FOR SELECT 
USING (true);

CREATE POLICY "Students are viewable by everyone during registration" 
ON public.students FOR SELECT 
USING (true);

CREATE POLICY "Teachers are viewable by everyone during registration" 
ON public.teachers FOR SELECT 
USING (true);

CREATE POLICY "Teacher classes are viewable by everyone" 
ON public.teacher_classes FOR SELECT 
USING (true);

-- Admin policies for management
CREATE POLICY "Admins can manage classes" 
ON public.classes FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage streams" 
ON public.streams FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage students" 
ON public.students FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage teachers" 
ON public.teachers FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage teacher classes" 
ON public.teacher_classes FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample data for testing
INSERT INTO public.classes (name) VALUES 
  ('Form 1'),
  ('Form 2'),
  ('Form 3'),
  ('Form 4');

INSERT INTO public.streams (class_id, name) 
SELECT c.id, s.name
FROM public.classes c
CROSS JOIN (VALUES ('East'), ('West'), ('North'), ('South')) AS s(name);

-- Sample students (you can add more later)
INSERT INTO public.students (name, class_id, stream_id)
SELECT 
  'Student ' || row_number() OVER (),
  s.class_id,
  s.id
FROM public.streams s
CROSS JOIN generate_series(1, 5) AS n;