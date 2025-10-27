-- Fix electoral_votes RLS policies to work with custom auth system
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Students can view own votes" ON public.electoral_votes;
DROP POLICY IF EXISTS "Students can create own votes" ON public.electoral_votes;

-- Create permissive policies that work with custom auth
CREATE POLICY "Allow authenticated vote insertion"
ON public.electoral_votes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow viewing all votes"
ON public.electoral_votes FOR SELECT
TO authenticated
USING (true);

-- Allow anonymous access (needed for custom auth)
CREATE POLICY "Allow anonymous vote insertion"
ON public.electoral_votes FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous viewing votes"
ON public.electoral_votes FOR SELECT
TO anon
USING (true);

-- Also fix electoral_applications policies
DROP POLICY IF EXISTS "Students can view all applications" ON public.electoral_applications;
CREATE POLICY "Allow viewing all applications"
ON public.electoral_applications FOR SELECT
TO anon, authenticated
USING (true);

-- Fix electoral_positions policies  
DROP POLICY IF EXISTS "Anyone can view positions" ON public.electoral_positions;
CREATE POLICY "Allow viewing all positions"
ON public.electoral_positions FOR SELECT
TO anon, authenticated
USING (true);
