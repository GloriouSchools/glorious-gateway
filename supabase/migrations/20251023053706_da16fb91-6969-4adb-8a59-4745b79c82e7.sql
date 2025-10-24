-- Add RLS policy for teachers table to allow authentication
DROP POLICY IF EXISTS "Allow public read access for authentication" ON public.teachers;

CREATE POLICY "Allow public read access for authentication"
ON public.teachers
FOR SELECT
USING (true);