-- Add RLS policies for classes and streams tables to allow read access
DROP POLICY IF EXISTS "Allow public read access" ON public.classes;
DROP POLICY IF EXISTS "Allow public read access" ON public.streams;

CREATE POLICY "Allow public read access"
ON public.classes
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.streams
FOR SELECT
USING (true);