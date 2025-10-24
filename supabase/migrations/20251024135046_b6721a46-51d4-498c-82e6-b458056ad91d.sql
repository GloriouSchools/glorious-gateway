-- Add RLS policies to allow reading students and classes data

-- Allow public to query students (needed for stats, dashboards, etc.)
CREATE POLICY "Allow public to query students"
  ON public.students
  FOR SELECT
  USING (true);

-- Allow public to query classes (needed for stats, dashboards, etc.)
CREATE POLICY "Allow public to query classes"
  ON public.classes
  FOR SELECT
  USING (true);

-- Allow public to query attendance_records (needed for attendance tracking)
CREATE POLICY "Allow public to query attendance_records"
  ON public.attendance_records
  FOR SELECT
  USING (true);

-- Allow public to query electoral_applications
CREATE POLICY "Allow public to query electoral_applications"
  ON public.electoral_applications
  FOR SELECT
  USING (true);

-- Allow public to query electoral_positions
CREATE POLICY "Allow public to query electoral_positions"
  ON public.electoral_positions
  FOR SELECT
  USING (true);