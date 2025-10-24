-- Clean up streams table by removing duplicate uppercase columns
ALTER TABLE public.streams 
  DROP COLUMN IF EXISTS "ID",
  DROP COLUMN IF EXISTS "Name",
  DROP COLUMN IF EXISTS "Description",
  DROP COLUMN IF EXISTS "Class",
  DROP COLUMN IF EXISTS "Students",
  DROP COLUMN IF EXISTS "Created At",
  DROP COLUMN IF EXISTS "Updated At";

-- Ensure the correct columns exist with proper types
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streams' AND column_name = 'id') THEN
    ALTER TABLE public.streams ADD COLUMN id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streams' AND column_name = 'name') THEN
    ALTER TABLE public.streams ADD COLUMN name TEXT NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streams' AND column_name = 'class_id') THEN
    ALTER TABLE public.streams ADD COLUMN class_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streams' AND column_name = 'created_at') THEN
    ALTER TABLE public.streams ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streams' AND column_name = 'updated_at') THEN
    ALTER TABLE public.streams ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create index on class_id for better performance
CREATE INDEX IF NOT EXISTS idx_streams_class_id ON public.streams(class_id);

-- Enable RLS on streams
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view streams" 
  ON public.streams 
  FOR SELECT 
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.streams;