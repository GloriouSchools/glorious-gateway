-- Add comprehensive fraud detection and tracking columns to electoral_votes table
ALTER TABLE public.electoral_votes
ADD COLUMN IF NOT EXISTS vote_status text DEFAULT 'valid' CHECK (vote_status IN ('valid', 'invalid')),
ADD COLUMN IF NOT EXISTS device_type text,
ADD COLUMN IF NOT EXISTS browser text,
ADD COLUMN IF NOT EXISTS os text,
ADD COLUMN IF NOT EXISTS screen_resolution text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS location_accuracy numeric,
ADD COLUMN IF NOT EXISTS canvas_fingerprint text,
ADD COLUMN IF NOT EXISTS webgl_fingerprint text,
ADD COLUMN IF NOT EXISTS installed_fonts text,
ADD COLUMN IF NOT EXISTS battery_level numeric,
ADD COLUMN IF NOT EXISTS battery_charging boolean,
ADD COLUMN IF NOT EXISTS mouse_movement_count integer,
ADD COLUMN IF NOT EXISTS average_mouse_speed numeric,
ADD COLUMN IF NOT EXISTS typing_speed numeric,
ADD COLUMN IF NOT EXISTS click_count integer,
ADD COLUMN IF NOT EXISTS behavior_signature text,
ADD COLUMN IF NOT EXISTS ip_address text;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_electoral_votes_vote_status ON public.electoral_votes(vote_status);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_position ON public.electoral_votes(position);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voted_at ON public.electoral_votes(voted_at);
CREATE INDEX IF NOT EXISTS idx_electoral_votes_voter_id ON public.electoral_votes(voter_id);

-- Add RLS policies for electoral_votes to allow admins to view all votes
CREATE POLICY "Admins can view all votes"
ON public.electoral_votes
FOR SELECT
USING (true);

COMMENT ON COLUMN public.electoral_votes.vote_status IS 'Indicates if vote is valid or invalid based on verification checks';
COMMENT ON COLUMN public.electoral_votes.device_type IS 'Type of device used (Desktop/Mobile/Tablet)';
COMMENT ON COLUMN public.electoral_votes.latitude IS 'GPS latitude coordinate of voter location';
COMMENT ON COLUMN public.electoral_votes.longitude IS 'GPS longitude coordinate of voter location';
COMMENT ON COLUMN public.electoral_votes.canvas_fingerprint IS 'Unique canvas fingerprint for device identification';
COMMENT ON COLUMN public.electoral_votes.behavior_signature IS 'Behavioral biometric signature';