-- Update stream IDs to be readable like class IDs
-- Create readable IDs based on class_id and stream name

-- First, let's update the streams to have readable IDs
UPDATE public.streams 
SET id = CONCAT(class_id, '-', UPPER(name))
WHERE id IS NOT NULL AND name IS NOT NULL AND class_id IS NOT NULL;

-- Also update the duplicate columns that seem to exist
UPDATE public.streams 
SET "ID" = id,
    "Name" = name,
    "Class" = class_id
WHERE id IS NOT NULL;

-- Update any references in students table to use new stream IDs
UPDATE public.students 
SET stream_id = s.id
FROM (
    SELECT CONCAT(class_id, '-', UPPER(name)) as new_id, 
           CONCAT(class_id, '-', UPPER(name)) as id
    FROM public.streams 
    WHERE name IS NOT NULL AND class_id IS NOT NULL
) s
WHERE students.stream_id IN (
    SELECT old_streams.old_id 
    FROM (
        SELECT id as old_id, CONCAT(class_id, '-', UPPER(name)) as new_id
        FROM public.streams 
        WHERE name IS NOT NULL AND class_id IS NOT NULL
    ) old_streams
) 
AND students.stream_id IS NOT NULL;