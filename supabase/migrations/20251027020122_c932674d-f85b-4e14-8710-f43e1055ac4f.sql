-- Create electoral_votes table
CREATE TABLE public.electoral_votes (
  id text NOT NULL DEFAULT (gen_random_uuid())::text,
  voter_id text NOT NULL,
  voter_name text NOT NULL,
  position text NOT NULL,
  candidate_id text NOT NULL,
  candidate_name text NOT NULL,
  voted_at timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  vote_status text NULL DEFAULT 'valid'::text,
  device_type text NULL,
  browser text NULL,
  os text NULL,
  screen_resolution text NULL,
  timezone text NULL,
  language text NULL,
  latitude numeric NULL,
  longitude numeric NULL,
  location_accuracy numeric NULL,
  canvas_fingerprint text NULL,
  webgl_fingerprint text NULL,
  installed_fonts text NULL,
  battery_level numeric NULL,
  battery_charging boolean NULL,
  mouse_movement_count integer NULL,
  average_mouse_speed numeric NULL,
  typing_speed numeric NULL,
  click_count integer NULL,
  behavior_signature text NULL,
  ip_address text NULL,
  CONSTRAINT electoral_votes_pkey PRIMARY KEY (id),
  CONSTRAINT electoral_votes_vote_status_check CHECK (
    vote_status = ANY (ARRAY['valid'::text, 'invalid'::text])
  )
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voter_id ON public.electoral_votes USING btree (voter_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_electoral_votes_position ON public.electoral_votes USING btree (position) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_electoral_votes_candidate_id ON public.electoral_votes USING btree (candidate_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_electoral_votes_vote_status ON public.electoral_votes USING btree (vote_status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voted_at ON public.electoral_votes USING btree (voted_at) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE public.electoral_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for monitoring)
CREATE POLICY "Anyone can view votes" ON public.electoral_votes
  FOR SELECT USING (true);

-- Create policy for inserting votes
CREATE POLICY "Anyone can cast votes" ON public.electoral_votes
  FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE electoral_votes;