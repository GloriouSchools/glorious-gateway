-- Fix the default_password update to only pad existing non-null passwords
-- Don't set NULL passwords to '0000'
UPDATE students
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL 
  AND default_password != ''
  AND LENGTH(default_password) < 4
  AND (password_hash IS NULL OR password_hash = '');

-- Create physical_votes table for storing physical ballot votes
CREATE TABLE IF NOT EXISTS public.physical_votes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  candidate_id TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  position TEXT NOT NULL,
  votes_count BIGINT NOT NULL DEFAULT 0,
  notes TEXT,
  added_by TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on physical_votes
ALTER TABLE public.physical_votes ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_physical_votes_candidate ON public.physical_votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_physical_votes_position ON public.physical_votes(position);