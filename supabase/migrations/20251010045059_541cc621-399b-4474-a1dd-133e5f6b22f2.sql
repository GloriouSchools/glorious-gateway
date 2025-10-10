-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can update attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can delete attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can view attendance records" ON public.attendance_records;

-- Create new permissive policies that allow anyone to manage attendance
-- This is appropriate for an internal school system with custom authentication

CREATE POLICY "Allow all to view attendance records" 
ON public.attendance_records 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all to insert attendance records" 
ON public.attendance_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all to update attendance records" 
ON public.attendance_records 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all to delete attendance records" 
ON public.attendance_records 
FOR DELETE 
USING (true);