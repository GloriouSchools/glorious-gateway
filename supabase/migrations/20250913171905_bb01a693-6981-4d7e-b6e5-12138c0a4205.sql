-- Add unique constraint to prevent duplicate votes per user per position
ALTER TABLE public.electoral_votes 
ADD CONSTRAINT electoral_votes_voter_position_unique UNIQUE (voter_id, position);

-- Add index for better query performance on votes
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voter_id ON public.electoral_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_position ON public.electoral_votes(position);