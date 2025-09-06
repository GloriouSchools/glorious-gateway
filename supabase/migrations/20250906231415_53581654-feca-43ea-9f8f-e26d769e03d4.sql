-- Add personal_email column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS personal_email text,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Add personal_email column to teachers table if it doesn't exist
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS personal_email text,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Create admin_profiles table to store admin personal email
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_email text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default admin profile if not exists
INSERT INTO public.admin_profiles (id, personal_email, is_verified)
VALUES ('00000000-0000-0000-0000-000000000001', null, false)
ON CONFLICT (id) DO NOTHING;

-- Create function for verifying user account with personal email
CREATE OR REPLACE FUNCTION public.verify_user_account(
  p_user_type text,
  p_user_id uuid,
  p_personal_email text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  -- Update based on user type
  IF p_user_type = 'student' THEN
    UPDATE public.students
    SET personal_email = p_personal_email,
        is_verified = true
    WHERE id = p_user_id;
    
    IF FOUND THEN
      v_result := json_build_object('success', true, 'message', 'Student account verified successfully');
    ELSE
      v_result := json_build_object('success', false, 'message', 'Student not found');
    END IF;
    
  ELSIF p_user_type = 'teacher' THEN
    UPDATE public.teachers
    SET personal_email = p_personal_email,
        is_verified = true
    WHERE id = p_user_id;
    
    IF FOUND THEN
      v_result := json_build_object('success', true, 'message', 'Teacher account verified successfully');
    ELSE
      v_result := json_build_object('success', false, 'message', 'Teacher not found');
    END IF;
    
  ELSIF p_user_type = 'admin' THEN
    UPDATE public.admin_profiles
    SET personal_email = p_personal_email,
        is_verified = true
    WHERE id = '00000000-0000-0000-0000-000000000001';
    
    v_result := json_build_object('success', true, 'message', 'Admin account verified successfully');
    
  ELSE
    v_result := json_build_object('success', false, 'message', 'Invalid user type');
  END IF;
  
  RETURN v_result;
END;
$$;

-- Update verify_flexible_login to check is_verified status
CREATE OR REPLACE FUNCTION public.verify_flexible_login(input_email text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_token uuid;
  user_record record;
  admin_record record;
  user_type text;
BEGIN
  -- Check admin first (hardcoded) - can login with either school or personal email
  SELECT * INTO admin_record FROM public.admin_profiles WHERE id = '00000000-0000-0000-0000-000000000001';
  
  IF (input_email = 'admin@glorious.com' AND input_password = 'Glorious@15') OR 
     (admin_record.personal_email IS NOT NULL AND input_email = admin_record.personal_email AND input_password = 'Glorious@15') THEN
    session_token := gen_random_uuid();
    DELETE FROM public.admin_sessions WHERE expires_at < now();
    INSERT INTO public.admin_sessions (token) VALUES (session_token::text);
    
    RETURN json_build_object(
      'success', true,
      'token', session_token,
      'role', 'admin',
      'name', 'System Administrator',
      'is_verified', admin_record.is_verified,
      'personal_email', admin_record.personal_email
    );
  END IF;
  
  -- Check for student with school email and default password
  IF input_email LIKE '%@glorious.com' AND input_password = '123' THEN
    SELECT id, name, class_id, stream_id, email, personal_email, is_verified
    INTO user_record
    FROM public.students
    WHERE email = input_email;
    
    IF FOUND THEN
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
        'is_verified', user_record.is_verified,
        'personal_email', user_record.personal_email
      );
    END IF;
  END IF;
  
  -- Check for student with personal email (if verified)
  SELECT id, name, class_id, stream_id, email, personal_email, is_verified
  INTO user_record
  FROM public.students
  WHERE personal_email = input_email AND is_verified = true;
  
  IF FOUND AND input_password = '123' THEN
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
      'is_verified', user_record.is_verified,
      'personal_email', user_record.personal_email
    );
  END IF;
  
  -- Check teachers (similar logic can be added later)
  
  RETURN json_build_object('success', false, 'message', 'Invalid credentials');
END;
$$;