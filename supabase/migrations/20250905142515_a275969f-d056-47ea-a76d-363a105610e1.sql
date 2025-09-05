-- Add email column to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS email text UNIQUE;

-- Update existing students with generated emails
UPDATE public.students 
SET email = LOWER(REPLACE(REPLACE(REPLACE(name, ' ', ''), '.', ''), '''', '')) || '@glorious.com';

-- Create student sessions table
CREATE TABLE IF NOT EXISTS public.student_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '24:00:00'::interval),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on student_sessions
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for student sessions (not directly accessible)
CREATE POLICY "Student sessions are not directly accessible" 
ON public.student_sessions 
FOR ALL 
USING (false);

-- Create function to verify student login
CREATE OR REPLACE FUNCTION public.verify_student_login(input_email text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to validate student token
CREATE OR REPLACE FUNCTION public.validate_student_token(input_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
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