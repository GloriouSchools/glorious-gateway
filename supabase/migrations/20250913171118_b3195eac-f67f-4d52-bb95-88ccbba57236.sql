-- First, remove duplicate applications keeping only the first one for each student
DELETE FROM public.electoral_applications 
WHERE id NOT IN (
  SELECT id 
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY created_at ASC) as rn
    FROM public.electoral_applications
  ) ranked
  WHERE rn = 1
);

-- Now add the unique constraint
ALTER TABLE public.electoral_applications
ADD CONSTRAINT electoral_applications_student_id_unique UNIQUE (student_id);