-- Create physical_votes table for tracking manual vote counts
CREATE TABLE IF NOT EXISTS public.physical_votes (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  candidate_id TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  position TEXT NOT NULL,
  votes_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.physical_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for physical_votes
CREATE POLICY "Anyone can view physical votes" 
ON public.physical_votes
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert physical votes" 
ON public.physical_votes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update physical votes" 
ON public.physical_votes
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete physical votes" 
ON public.physical_votes
FOR DELETE
USING (true);