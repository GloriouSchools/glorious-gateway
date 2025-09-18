-- Add default_password column to students table
ALTER TABLE public.students ADD COLUMN default_password TEXT;

-- Update existing students with default passwords based on their row number
-- This will assign passwords like 0001, 0002, etc.
WITH numbered_students AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) as row_num
  FROM public.students
)
UPDATE public.students 
SET default_password = LPAD(numbered_students.row_num::text, 4, '0')
FROM numbered_students 
WHERE public.students.id = numbered_students.id;