-- Add foreign key constraint from electoral_votes.candidate_id to electoral_applications.id
ALTER TABLE public.electoral_votes 
ADD CONSTRAINT electoral_votes_candidate_id_fkey 
FOREIGN KEY (candidate_id) REFERENCES public.electoral_applications(id);