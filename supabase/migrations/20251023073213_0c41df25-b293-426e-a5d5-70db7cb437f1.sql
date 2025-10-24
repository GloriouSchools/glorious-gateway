-- Create RLS policies for authentication queries
-- These policies allow SELECT access needed for the custom login system

-- Students table policies
CREATE POLICY "Allow public to query students for login"
  ON public.students
  FOR SELECT
  USING (true);

-- Teachers table policies  
CREATE POLICY "Allow public to query teachers for login"
  ON public.teachers
  FOR SELECT
  USING (true);

-- Admins table policies
CREATE POLICY "Allow public to query admins for login"
  ON public.admins
  FOR SELECT
  USING (true);

-- Note: These policies allow anyone to read user data including password hashes.
-- This is necessary for the current custom authentication system to work.
-- For better security, consider:
-- 1. Moving to Supabase Auth instead of custom authentication
-- 2. Creating a secure edge function for authentication
-- 3. Using proper password hashing (bcrypt) instead of plain text storage