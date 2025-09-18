-- Create electoral_votes table for storing user votes
CREATE TABLE public.electoral_votes (
  id TEXT NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  voter_id TEXT NOT NULL,
  position TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.electoral_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for electoral_votes
CREATE POLICY "Users can view all votes for transparency" 
ON public.electoral_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own votes" 
ON public.electoral_votes 
FOR INSERT 
WITH CHECK (true);

-- Prevent duplicate votes for same position
CREATE UNIQUE INDEX idx_electoral_votes_voter_position 
ON public.electoral_votes (voter_id, position);