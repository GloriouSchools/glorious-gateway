-- Add RLS policies for remaining tables without policies
DROP POLICY IF EXISTS "Allow public read access" ON public.electoral_applications;
DROP POLICY IF EXISTS "Allow public read access" ON public.electoral_positions;
DROP POLICY IF EXISTS "Allow public read access" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow public read access" ON public.staff;

CREATE POLICY "Allow public read access"
ON public.electoral_applications
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.electoral_positions
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.attendance_records
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.staff
FOR SELECT
USING (true);