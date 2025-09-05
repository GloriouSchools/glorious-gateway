-- Drop existing function first
DROP FUNCTION IF EXISTS public.verify_admin_login(text, text);

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
DROP POLICY IF EXISTS "Admin sessions are not directly accessible" ON public.admin_sessions;
CREATE POLICY "Admin sessions are not directly accessible" 
ON public.admin_sessions 
FOR ALL 
USING (false);

-- Create new verify_admin_login that returns session info
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
    
    -- Delete any existing expired sessions
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