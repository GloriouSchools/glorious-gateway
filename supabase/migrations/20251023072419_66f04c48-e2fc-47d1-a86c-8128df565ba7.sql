-- Create electoral_votes table for voting system
CREATE TABLE IF NOT EXISTS public.electoral_votes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  voter_id TEXT NOT NULL,
  voter_name TEXT NOT NULL,
  position TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on electoral_votes
ALTER TABLE public.electoral_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for electoral_votes
CREATE POLICY "Users can view their own votes" 
  ON public.electoral_votes 
  FOR SELECT 
  USING (auth.uid()::text = voter_id);

CREATE POLICY "Users can insert their own votes" 
  ON public.electoral_votes 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = voter_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voter_id ON public.electoral_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_position ON public.electoral_votes(position);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_candidate_id ON public.electoral_votes(candidate_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.electoral_votes;