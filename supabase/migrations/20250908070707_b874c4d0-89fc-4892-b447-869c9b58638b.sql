-- Update the verify_flexible_login function to handle default password "123"
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
  -- First, find the student by email or student_id
  SELECT * INTO v_student
  FROM public.students
  WHERE (email = p_identifier OR student_id = p_identifier);
  
  -- If student not found, return error
  IF v_student IS NULL THEN
    v_result := json_build_object('success', false, 'message', 'Student not found');
    RETURN v_result;
  END IF;
  
  -- Check password based on whether they have set a custom password
  IF v_student.password_hash IS NULL OR v_student.password_hash = '' THEN
    -- No custom password set, check if using default password "123"
    IF p_password = '123' THEN
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
  ELSE
    -- Custom password is set, check against stored password
    -- Try plaintext first (for passwords that weren't hashed)
    IF v_student.password_hash = p_password THEN
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
    -- Then try hashed password (if it's properly hashed and long enough)
    ELSIF LENGTH(v_student.password_hash) > 10 AND v_student.password_hash = extensions.crypt(p_password, v_student.password_hash) THEN
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
  END IF;
  
  RETURN v_result;
END;
$function$;