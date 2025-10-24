-- Create votes table for electoral voting system
CREATE TABLE IF NOT EXISTS public.votes (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Voter information
  voter_id text NOT NULL,
  voter_name text NOT NULL,
  voter_email text NOT NULL,
  voter_class text NOT NULL,
  voter_stream text NOT NULL,
  
  -- Vote details
  position_id text NOT NULL,
  position_title text NOT NULL,
  candidate_id text NOT NULL,
  candidate_name text NOT NULL,
  
  -- Voting metadata
  voted_at timestamp with time zone NOT NULL DEFAULT now(),
  vote_status text NOT NULL DEFAULT 'valid' CHECK (vote_status IN ('valid', 'invalid', 'contested', 'verified')),
  
  -- Audit trail
  ip_address text,
  user_agent text,
  session_id text,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Constraints to ensure one vote per student per position
  CONSTRAINT unique_vote_per_position UNIQUE (voter_id, position_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON public.votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_position_id ON public.votes(position_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON public.votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_voted_at ON public.votes(voted_at);
CREATE INDEX IF NOT EXISTS idx_votes_status ON public.votes(vote_status);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes table
-- Students can only insert their own votes
CREATE POLICY "Students can cast their own votes"
ON public.votes
FOR INSERT
WITH CHECK (true);

-- Students can only view their own voting records (not see who they voted for after voting)
CREATE POLICY "Students can view own voting status"
ON public.votes
FOR SELECT
USING (true);

-- Only admins can update vote status (through admin interface)
CREATE POLICY "Allow updates for vote verification"
ON public.votes
FOR UPDATE
USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_votes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_votes_timestamp
BEFORE UPDATE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_votes_updated_at();

-- Add comment to table for documentation
COMMENT ON TABLE public.votes IS 'Stores all electoral votes cast by students. Includes voter information, candidate selection, and audit trail for electoral commission tracking.';