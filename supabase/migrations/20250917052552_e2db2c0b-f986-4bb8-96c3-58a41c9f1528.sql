BEGIN;
-- 1) Temporarily allow updates on students
CREATE POLICY "Temp maintenance update students" ON public.students
FOR UPDATE USING (true) WITH CHECK (true);

-- 2) Perform the fix for CUBS emails and photo URLs
UPDATE public.students AS s
SET 
  email = lower(
    regexp_replace(
      split_part(btrim(s.name), ' ', 1) || coalesce(split_part(btrim(s.name), ' ', 2), ''),
      '[^a-z0-9]+', '', 'g'
    )
  ) || '@glorious.com',
  photo_url = 'https://fresh-teacher.github.io/gloriouschool/' || btrim(s.name) || '.jpg'
WHERE upper(trim(s.stream_id)) = 'CUBS';

-- 3) Drop the temporary policy
DROP POLICY "Temp maintenance update students" ON public.students;
COMMIT;