-- Fix P4 CUBS student emails and photo URLs
UPDATE public.students AS s
SET 
  email = (
    CASE 
      WHEN lower(regexp_replace(split_part(btrim(s.name), ' ', 1) || coalesce(split_part(btrim(s.name), ' ', 2), ''), '[^a-z0-9]+', '', 'g')) <> ''
      THEN lower(regexp_replace(split_part(btrim(s.name), ' ', 1) || coalesce(split_part(btrim(s.name), ' ', 2), ''), '[^a-z0-9]+', '', 'g'))
      ELSE lower(regexp_replace(btrim(s.name), '[^a-z0-9]+', '', 'g'))
    END
  ) || '@glorious.com',
  photo_url = 'https://fresh-teacher.github.io/gloriouschool/' || btrim(s.name) || '.jpg'
WHERE s.class_id = 'P4' AND s.stream_id IN ('CUBS', 'P4-CUBS');