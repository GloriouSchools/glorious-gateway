-- Fix security warnings by setting search_path for all functions

-- Update verify_student_login function with search_path
CREATE OR REPLACE FUNCTION public.verify_student_login(input_email text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  session_token uuid;
  student_record record;
BEGIN
  -- Check if password is the hardcoded "123"
  IF input_password != '123' THEN
    RETURN json_build_object('success', false, 'message', 'Invalid password');
  END IF;
  
  -- Find the student by email
  SELECT id, name, class_id, stream_id, email
  INTO student_record
  FROM public.students
  WHERE email = input_email;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Student not found');
  END IF;
  
  -- Generate a new session token
  session_token := gen_random_uuid();
  
  -- Delete any existing expired sessions for this student
  DELETE FROM public.student_sessions 
  WHERE student_id = student_record.id AND expires_at < now();
  
  -- Create new session
  INSERT INTO public.student_sessions (student_id, token)
  VALUES (student_record.id, session_token::text);
  
  -- Return session info
  RETURN json_build_object(
    'success', true,
    'token', session_token,
    'role', 'student',
    'name', student_record.name,
    'student_id', student_record.id,
    'email', student_record.email
  );
END;
$function$;

-- Update validate_student_token function with search_path
CREATE OR REPLACE FUNCTION public.validate_student_token(input_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  student_record record;
BEGIN
  SELECT s.id, s.name, s.email, ss.student_id
  INTO student_record
  FROM public.student_sessions ss
  JOIN public.students s ON s.id = ss.student_id
  WHERE ss.token = input_token 
  AND ss.expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false);
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'student_id', student_record.student_id,
    'name', student_record.name,
    'email', student_record.email
  );
END;
$function$;

-- Update verify_admin_login function with search_path
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Update validate_admin_token function with search_path
CREATE OR REPLACE FUNCTION public.validate_admin_token(input_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_sessions 
    WHERE token = input_token 
    AND expires_at > now()
  );
END;
$function$;