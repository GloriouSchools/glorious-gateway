-- Comprehensive ID standardization across all tables

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
    class_id, 
    '-', 
    UPPER(REPLACE(COALESCE((SELECT name FROM public.streams WHERE streams.class_id = students.class_id AND streams.id = students.stream_id LIMIT 1), 'STREAM'), ' ', '-')),
    '-',
    UPPER(REPLACE(REPLACE(name, ' ', '-'), '.', ''))
)
WHERE id IS NOT NULL AND name IS NOT NULL AND class_id IS NOT NULL;

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
SET stream_id = CONCAT(class_id, '-', UPPER(REPLACE(s.name, ' ', '-')))
FROM public.streams s
WHERE s.class_id = students.class_id 
AND s.name IS NOT NULL
AND students.stream_id IS NOT NULL;

-- 7. Update electoral_applications to reference new student IDs
UPDATE public.electoral_applications 
SET student_id = CONCAT(
    ea.class_name, 
    '-', 
    UPPER(REPLACE(COALESCE(ea.stream_name, 'STREAM'), ' ', '-')),
    '-',
    UPPER(REPLACE(REPLACE(ea.student_name, ' ', '-'), '.', ''))
)
FROM public.electoral_applications ea
WHERE electoral_applications.id = ea.id
AND ea.student_name IS NOT NULL 
AND ea.class_name IS NOT NULL;

-- 8. Update electoral_votes to reference new IDs
-- Update voter_id to match new student IDs
UPDATE public.electoral_votes 
SET voter_id = CONCAT(
    'FORM-', 
    CASE 
        WHEN voter_name LIKE '%Form 1%' THEN '1'
        WHEN voter_name LIKE '%Form 2%' THEN '2' 
        WHEN voter_name LIKE '%Form 3%' THEN '3'
        WHEN voter_name LIKE '%Form 4%' THEN '4'
        ELSE '1'
    END,
    '-STREAM-',
    UPPER(REPLACE(REPLACE(voter_name, ' ', '-'), '.', ''))
)
WHERE voter_id IS NOT NULL AND voter_name IS NOT NULL;

-- Update candidate_id to match new student IDs  
UPDATE public.electoral_votes 
SET candidate_id = CONCAT(
    'FORM-',
    CASE 
        WHEN candidate_name LIKE '%Form 1%' THEN '1'
        WHEN candidate_name LIKE '%Form 2%' THEN '2'
        WHEN candidate_name LIKE '%Form 3%' THEN '3' 
        WHEN candidate_name LIKE '%Form 4%' THEN '4'
        ELSE '1'
    END,
    '-STREAM-',
    UPPER(REPLACE(REPLACE(candidate_name, ' ', '-'), '.', ''))
)
WHERE candidate_id IS NOT NULL AND candidate_name IS NOT NULL;