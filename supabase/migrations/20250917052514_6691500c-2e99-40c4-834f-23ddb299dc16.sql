-- Update emails for P4 CUBS students to first-two-names@glorious.com
UPDATE public.students AS s
SET email = lower(
  regexp_replace(
    split_part(btrim(s.name), ' ', 1) || coalesce(split_part(btrim(s.name), ' ', 2), ''),
    '[^a-z0-9]+', '', 'g'
  )
) || '@glorious.com'
WHERE upper(trim(s.stream_id)) = 'CUBS';