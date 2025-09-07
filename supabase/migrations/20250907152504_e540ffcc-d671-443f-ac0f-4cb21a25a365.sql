-- First, let's verify and update existing students with correct data
-- This will ensure all students have proper emails and are in the correct classes/streams

-- Function to generate email from name
CREATE OR REPLACE FUNCTION generate_student_email(student_name text)
RETURNS text AS $$
BEGIN
  RETURN lower(replace(student_name, ' ', '')) || '@glorious.com';
END;
$$ LANGUAGE plpgsql;

-- Update existing students' emails based on their names
UPDATE students 
SET email = generate_student_email(name)
WHERE email IS NULL OR email = '';

-- Ensure all students can log in with both school email and personal email if verified
CREATE OR REPLACE FUNCTION public.verify_flexible_login(input_email text, input_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    SELECT s.id, s.name, s.class_id, s.stream_id, s.email, s.personal_email, s.is_verified,
           c.name as class_name, st.name as stream_name
    INTO user_record
    FROM public.students s
    LEFT JOIN public.classes c ON c.id = s.class_id
    LEFT JOIN public.streams st ON st.id = s.stream_id
    WHERE s.email = input_email;
    
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
        'class_name', user_record.class_name,
        'stream_name', user_record.stream_name,
        'is_verified', user_record.is_verified,
        'personal_email', user_record.personal_email
      );
    END IF;
  END IF;
  
  -- Check for student with personal email (if verified)
  SELECT s.id, s.name, s.class_id, s.stream_id, s.email, s.personal_email, s.is_verified,
         c.name as class_name, st.name as stream_name
  INTO user_record
  FROM public.students s
  LEFT JOIN public.classes c ON c.id = s.class_id
  LEFT JOIN public.streams st ON st.id = s.stream_id
  WHERE s.personal_email = input_email AND s.is_verified = true;
  
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
      'class_name', user_record.class_name,
      'stream_name', user_record.stream_name,
      'is_verified', user_record.is_verified,
      'personal_email', user_record.personal_email
    );
  END IF;
  
  -- Check teachers (similar logic can be added later)
  
  RETURN json_build_object('success', false, 'message', 'Invalid credentials');
END;
$function$;