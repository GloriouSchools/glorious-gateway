-- Update the verify_flexible_login function to safely handle different password formats
CREATE OR REPLACE FUNCTION public.verify_flexible_login(p_identifier text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $function$
DECLARE
  v_student RECORD;
  v_result JSON;
BEGIN
  -- First try to find student by email or student_id with plaintext password (for existing data)
  SELECT * INTO v_student
  FROM public.students
  WHERE (email = p_identifier OR student_id = p_identifier)
  AND password_hash = p_password;
  
  -- If not found with plaintext, try with crypt (only if password_hash is not empty and has proper format)
  IF v_student IS NULL THEN
    SELECT * INTO v_student
    FROM public.students
    WHERE (email = p_identifier OR student_id = p_identifier)
    AND password_hash IS NOT NULL 
    AND password_hash != '' 
    AND LENGTH(password_hash) > 10  -- Only try crypt if hash looks like it could be a proper hash
    AND password_hash = extensions.crypt(p_password, password_hash);
  END IF;
  
  -- If still not found, check if user exists but has empty password (needs password setup)
  IF v_student IS NULL THEN
    SELECT * INTO v_student
    FROM public.students
    WHERE (email = p_identifier OR student_id = p_identifier)
    AND (password_hash IS NULL OR password_hash = '');
    
    IF v_student IS NOT NULL THEN
      v_result := json_build_object('success', false, 'message', 'Account found but password not set. Please contact administrator.');
      RETURN v_result;
    END IF;
  END IF;
  
  IF v_student IS NOT NULL THEN
    v_result := json_build_object(
      'success', true,
      'user_type', 'student',
      'student_id', v_student.student_id,
      'email', v_student.email,
      'name', v_student.name,
      'is_verified', v_student.is_verified,
      'personal_email', v_student.personal_email,
      'role', 'student',
      'token', v_student.id::text
    );
  ELSE
    v_result := json_build_object('success', false, 'message', 'Invalid credentials');
  END IF;
  
  RETURN v_result;
END;
$function$;