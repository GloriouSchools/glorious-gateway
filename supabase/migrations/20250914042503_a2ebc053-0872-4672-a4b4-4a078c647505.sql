-- Comprehensive ID standardization across all tables (fixed version)

-- 1. Update streams to have readable IDs (class-stream format)
UPDATE public.streams 
SET id = CONCAT(class_id, '-', UPPER(REPLACE(name, ' ', '-')))
WHERE id IS NOT NULL AND name IS NOT NULL AND class_id IS NOT NULL;

-- Update duplicate columns in streams
UPDATE public.streams 
SET "ID" = id,
    "Name" = name,
    "Class" = class_id
WHERE id IS NOT NULL;

-- 2. Update students to have readable IDs (class-stream-name format)
UPDATE public.students 
SET id = CONCAT(
    students.class_id, 
    '-', 
    UPPER(REPLACE(COALESCE((SELECT name FROM public.streams WHERE streams.class_id = students.class_id LIMIT 1), 'STREAM'), ' ', '-')),
    '-',
    UPPER(REPLACE(REPLACE(students.name, ' ', '-'), '.', ''))
)
WHERE students.id IS NOT NULL AND students.name IS NOT NULL AND students.class_id IS NOT NULL;

-- 3. Update teachers to have readable IDs (TEACHER-name format)
UPDATE public.teachers 
SET id = CONCAT('TEACHER-', UPPER(REPLACE(REPLACE(name, ' ', '-'), '.', '')))
WHERE id IS NOT NULL AND name IS NOT NULL;

-- 4. Update admins to have readable IDs (ADMIN-name format)  
UPDATE public.admins 
SET id = CONCAT('ADMIN-', UPPER(REPLACE(REPLACE(name, ' ', '-'), '.', '')))
WHERE id IS NOT NULL AND name IS NOT NULL;

-- 5. Update electoral positions to have readable IDs (position title format)
UPDATE public.electoral_positions 
SET id = UPPER(REPLACE(REPLACE(title, ' ', '-'), '.', ''))
WHERE id IS NOT NULL AND title IS NOT NULL;

-- 6. Update stream_id references in students table to match new stream IDs
UPDATE public.students 
SET stream_id = CONCAT(students.class_id, '-', UPPER(REPLACE(s.name, ' ', '-')))
FROM public.streams s
WHERE s.class_id = students.class_id 
AND s.name IS NOT NULL
AND students.stream_id IS NOT NULL;