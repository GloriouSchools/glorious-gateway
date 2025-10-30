-- Delete duplicate votes from electoral_votes table
-- Keep only the earliest vote per voter_id and position combination
DELETE FROM public.electoral_votes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY voter_id, position ORDER BY created_at ASC) as rn
    FROM public.electoral_votes
  ) t
  WHERE rn > 1
);