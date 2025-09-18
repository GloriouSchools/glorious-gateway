-- Fix teachers table schema to match application expectations
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS personal_email TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate existing photo data to photo_url
UPDATE public.teachers SET photo_url = photo WHERE photo IS NOT NULL;

-- Fix streams table schema to match application expectations  
ALTER TABLE public.streams
ADD COLUMN IF NOT EXISTS id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS class_id TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate existing data from capitalized columns
UPDATE public.streams SET 
  id = "ID",
  name = "Name", 
  class_id = "Class",
  created_at = CASE 
    WHEN "Created At" IS NOT NULL THEN "Created At"::TIMESTAMP WITH TIME ZONE
    ELSE NOW()
  END,
  updated_at = CASE 
    WHEN "Updated At" IS NOT NULL THEN "Updated At"::TIMESTAMP WITH TIME ZONE  
    ELSE NOW()
  END
WHERE "ID" IS NOT NULL;

-- Create update trigger for teachers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streams_updated_at  
  BEFORE UPDATE ON public.streams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();