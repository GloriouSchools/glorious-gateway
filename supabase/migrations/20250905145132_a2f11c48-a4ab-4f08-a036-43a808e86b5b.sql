-- Add personal_email column to students table
ALTER TABLE public.students 
ADD COLUMN personal_email text UNIQUE,
ADD COLUMN password_hash text;

-- Add personal_email column to teachers table  
ALTER TABLE public.teachers
ADD COLUMN personal_email text UNIQUE,
ADD COLUMN password_hash text;

-- Update profiles table to track if account is secured
ALTER TABLE public.profiles
ADD COLUMN is_account_secured boolean DEFAULT false,
ADD COLUMN personal_email text UNIQUE;

-- Create a function to update student password
CREATE OR REPLACE FUNCTION public.update_student_password(
  p_student_id uuid,
  p_personal_email text,
  p_password_hash text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update student record with personal email and password
  UPDATE public.students
  SET personal_email = p_personal_email,
      password_hash = p_password_hash
  WHERE id = p_student_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Student not found');
  END IF;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Create a function to verify login with either school or personal email
CREATE OR REPLACE FUNCTION public.verify_flexible_login(
  input_email text,
  input_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_token uuid;
  user_record record;
  user_type text;
BEGIN
  -- Check admin first (hardcoded)
  IF input_email = 'admin@glorious.com' AND input_password = 'Glorious@15' THEN
    session_token := gen_random_uuid();
    DELETE FROM public.admin_sessions WHERE expires_at < now();
    INSERT INTO public.admin_sessions (token) VALUES (session_token::text);
    
    RETURN json_build_object(
      'success', true,
      'token', session_token,
      'role', 'admin',
      'name', 'System Administrator',
      'is_secured', false
    );
  END IF;
  
  -- Check for student with school email and default password
  IF input_email LIKE '%@glorious.com' AND input_password = '123' THEN
    SELECT id, name, class_id, stream_id, email, personal_email, password_hash
    INTO user_record
    FROM public.students
    WHERE email = input_email;
    
    IF FOUND THEN
      -- Only allow default password if no personal password is set
      IF user_record.password_hash IS NOT NULL THEN
        RETURN json_build_object('success', false, 'message', 'Please use your personal password');
      END IF;
      
      session_token := gen_random_uuid();
      DELETE FROM public.student_sessions WHERE student_id = user_record.id AND expires_at < now();
      INSERT INTO public.student_sessions (student_id, token) VALUES (user_record.id, session_token::text);
      
      RETURN json_build_object(
        'success', true,
        'token', session_token,
        'role', 'student',
        'name', user_record.name,
        'student_id', user_record.id,
        'email', user_record.email,
        'is_secured', (user_record.personal_email IS NOT NULL)
      );
    END IF;
  END IF;
  
  -- Check for student with personal email
  SELECT id, name, class_id, stream_id, email, personal_email, password_hash
  INTO user_record
  FROM public.students
  WHERE (personal_email = input_email OR email = input_email) AND password_hash IS NOT NULL;
  
  IF FOUND THEN
    -- Verify password (in production, this should use proper password hashing)
    IF user_record.password_hash = input_password THEN
      session_token := gen_random_uuid();
      DELETE FROM public.student_sessions WHERE student_id = user_record.id AND expires_at < now();
      INSERT INTO public.student_sessions (student_id, token) VALUES (user_record.id, session_token::text);
      
      RETURN json_build_object(
        'success', true,
        'token', session_token,
        'role', 'student',
        'name', user_record.name,
        'student_id', user_record.id,
        'email', user_record.email,
        'is_secured', true
      );
    END IF;
  END IF;
  
  -- Check teachers (similar logic can be added later)
  
  RETURN json_build_object('success', false, 'message', 'Invalid credentials');
END;
$$;