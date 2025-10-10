-- Add missing columns to teachers table
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS teacher_id TEXT,
ADD COLUMN IF NOT EXISTS sex TEXT,
ADD COLUMN IF NOT EXISTS photo TEXT,
ADD COLUMN IF NOT EXISTS subjectsTaught TEXT,
ADD COLUMN IF NOT EXISTS classesTaught TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS contactNumber BIGINT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add missing columns to students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS default_password TEXT;

-- Ensure electoral_applications table exists
CREATE TABLE IF NOT EXISTS public.electoral_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  eligible_classes JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure electoral_positions table exists
CREATE TABLE IF NOT EXISTS public.electoral_positions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  eligible_classes JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on electoral tables
ALTER TABLE public.electoral_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_positions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to electoral_applications" ON public.electoral_applications;
DROP POLICY IF EXISTS "Allow public read access to electoral_positions" ON public.electoral_positions;

-- Create policies for electoral_applications (allow read for everyone)
CREATE POLICY "Allow public read access to electoral_applications"
  ON public.electoral_applications FOR SELECT
  USING (true);

-- Create policies for electoral_positions (allow read for everyone)
CREATE POLICY "Allow public read access to electoral_positions"
  ON public.electoral_positions FOR SELECT
  USING (true);