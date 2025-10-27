-- Fix RLS policies for custom authentication system

-- Add policies for admins table
CREATE POLICY "Public read access for admins"
ON public.admins FOR SELECT
TO anon, authenticated
USING (true);

-- Allow public INSERT for students, teachers, admins (for signup functionality if needed)
CREATE POLICY "Allow insert for students"
ON public.students FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for students"
ON public.students FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Allow insert for teachers"
ON public.teachers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for teachers"
ON public.teachers FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Allow insert for admins"
ON public.admins FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for admins"
ON public.admins FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow INSERT and UPDATE for attendance records
CREATE POLICY "Allow insert for attendance_records"
ON public.attendance_records FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for attendance_records"
ON public.attendance_records FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow INSERT and UPDATE for electoral applications
CREATE POLICY "Allow insert for electoral_applications"
ON public.electoral_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow update for electoral_applications"
ON public.electoral_applications FOR UPDATE
TO anon, authenticated
USING (true);