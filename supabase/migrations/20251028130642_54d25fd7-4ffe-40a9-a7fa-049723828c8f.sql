-- Create physical_votes table to store votes cast physically
CREATE TABLE IF NOT EXISTS public.physical_votes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  candidate_id TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  position TEXT NOT NULL,
  votes_count INTEGER NOT NULL DEFAULT 0,
  added_by TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_physical_votes_candidate ON public.physical_votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_physical_votes_position ON public.physical_votes(position);

-- Enable RLS
ALTER TABLE public.physical_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public can read, but data needs to exist for display)
CREATE POLICY "Anyone can view physical votes"
  ON public.physical_votes FOR SELECT
  USING (true);

-- Admin insert/update policies can be added later based on auth implementation
CREATE POLICY "Allow all to insert physical votes"
  ON public.physical_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update physical votes"
  ON public.physical_votes FOR UPDATE
  USING (true);

CREATE POLICY "Allow all to delete physical votes"
  ON public.physical_votes FOR DELETE
  USING (true);