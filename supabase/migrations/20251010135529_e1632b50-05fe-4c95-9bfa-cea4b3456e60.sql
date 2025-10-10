-- Create electoral_applications table
CREATE TABLE public.electoral_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_photo TEXT,
  position TEXT NOT NULL,
  class_name TEXT NOT NULL,
  stream_name TEXT NOT NULL,
  sex TEXT,
  age TEXT,
  class_teacher TEXT,
  parent_name TEXT,
  parent_contact TEXT,
  experience TEXT,
  qualifications TEXT,
  why_apply TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.electoral_applications ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users
CREATE POLICY "Anyone can view applications"
  ON public.electoral_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own application"
  ON public.electoral_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "Users can update their own application"
  ON public.electoral_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id);

CREATE POLICY "Users can delete their own application"
  ON public.electoral_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = student_id);