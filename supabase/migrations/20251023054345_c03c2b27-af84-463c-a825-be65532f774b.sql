-- Fix security warning: Drop trigger, recreate function with search_path, then recreate trigger
DROP TRIGGER IF EXISTS update_votes_timestamp ON public.votes;
DROP FUNCTION IF EXISTS public.update_votes_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_votes_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_votes_timestamp
BEFORE UPDATE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_votes_updated_at();