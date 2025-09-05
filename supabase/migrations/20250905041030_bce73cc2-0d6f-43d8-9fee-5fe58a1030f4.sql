-- Create a simpler admin verification without foreign key constraints
-- Drop the previous function that tried to create admin user
DROP FUNCTION IF EXISTS public.create_admin_user();

-- Create a secure admin session table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin sessions (only accessible via functions)
CREATE POLICY "Admin sessions are not directly accessible" 
ON public.admin_sessions 
FOR ALL 
USING (false);

-- Update verify_admin_login to create a session token
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_token uuid;
BEGIN
  -- Only allow this specific admin login
  IF input_email = 'admin@glorious.com' AND input_password = 'Glorious@15' THEN
    -- Generate a new session token
    session_token := gen_random_uuid();
    
    -- Delete any existing sessions
    DELETE FROM public.admin_sessions WHERE expires_at < now();
    
    -- Create new session
    INSERT INTO public.admin_sessions (token)
    VALUES (session_token::text);
    
    -- Return session info
    RETURN json_build_object(
      'success', true,
      'token', session_token,
      'role', 'admin',
      'name', 'System Administrator'
    );
  ELSE
    RETURN json_build_object('success', false);
  END IF;
END;
$$;

-- Create a function to validate admin token
CREATE OR REPLACE FUNCTION public.validate_admin_token(input_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_sessions 
    WHERE token = input_token 
    AND expires_at > now()
  );
END;
$$;

-- Update RLS policies to check for admin token in request headers
-- This requires updating the has_role function to also check admin sessions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req_headers json;
  admin_token text;
BEGIN
  -- First check if user has admin role (for regular users who might be admins)
  IF auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN true;
  END IF;
  
  -- Get the request headers
  req_headers := current_setting('request.headers', true)::json;
  
  -- Extract admin token from headers if present
  IF req_headers IS NOT NULL AND req_headers->>'x-admin-token' IS NOT NULL THEN
    admin_token := req_headers->>'x-admin-token';
    RETURN validate_admin_token(admin_token);
  END IF;
  
  RETURN false;
END;
$$;

-- Update all admin RLS policies to use the new is_admin function
-- For classes table
DROP POLICY IF EXISTS "Admins can manage classes" ON public.classes;
CREATE POLICY "Admins can manage classes" 
ON public.classes 
FOR ALL 
USING (is_admin());

-- For streams table
DROP POLICY IF EXISTS "Admins can manage streams" ON public.streams;
CREATE POLICY "Admins can manage streams" 
ON public.streams 
FOR ALL 
USING (is_admin());

-- For students table
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
CREATE POLICY "Admins can manage students" 
ON public.students 
FOR ALL 
USING (is_admin());

-- For teachers table
DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;
CREATE POLICY "Admins can manage teachers" 
ON public.teachers 
FOR ALL 
USING (is_admin());

-- For teacher_classes table
DROP POLICY IF EXISTS "Admins can manage teacher classes" ON public.teacher_classes;
CREATE POLICY "Admins can manage teacher classes" 
ON public.teacher_classes 
FOR ALL 
USING (is_admin());

-- For profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING ((auth.uid() = id) OR is_admin());

-- For user_roles table
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());