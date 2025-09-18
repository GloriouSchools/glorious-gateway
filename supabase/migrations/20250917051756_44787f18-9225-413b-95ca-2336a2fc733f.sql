-- Update P4 CUBS students photo URLs to use full name pattern
UPDATE public.students 
SET photo_url = 'https://fresh-teacher.github.io/gloriouschool/' || name || '.jpg'
WHERE class_id = 'P4' AND stream_id = 'CUBS';