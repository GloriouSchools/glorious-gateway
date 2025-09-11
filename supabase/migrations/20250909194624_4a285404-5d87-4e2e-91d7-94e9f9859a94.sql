-- Update verify_flexible_login function to handle both NULL and empty string password_hash as default "123"
CREATE OR REPLACE FUNCTION public.verify_flexible_login(p_identifier text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_record RECORD;
  v_result JSON;
BEGIN
  -- Try to find user in admins table
  SELECT id, name, email, password_hash, is_verified, personal_email
  INTO v_user_record
  FROM admins 
  WHERE email = p_identifier AND (
    password_hash = p_password OR 
    (password_hash IS NULL AND p_password = '123') OR
    (password_hash = '' AND p_password = '123')
  );
  
  IF FOUND THEN
    SELECT json_build_object(
      'success', true,
      'role', 'admin',
      'token', 'admin-token-' || v_user_record.id,
      'name', v_user_record.name,
      'email', v_user_record.email,
      'is_verified', v_user_record.is_verified,
      'personal_email', v_user_record.personal_email
    ) INTO v_result;
    RETURN v_result;
  END IF;
  
  -- Try to find user in teachers table
  SELECT id, teacher_id, name, email, password_hash, is_verified, personal_email
  INTO v_user_record
  FROM teachers 
  WHERE email = p_identifier AND (
    password_hash::text = p_password OR 
    (password_hash IS NULL AND p_password = '123') OR
    (password_hash::text = '' AND p_password = '123')
  );
  
  IF FOUND THEN
    SELECT json_build_object(
      'success', true,
      'role', 'teacher',
      'token', 'teacher-token-' || v_user_record.id,
      'name', v_user_record.name,
      'email', v_user_record.email,
      'teacher_id', v_user_record.teacher_id,
      'is_verified', v_user_record.is_verified,
      'personal_email', v_user_record.personal_email
    ) INTO v_result;
    RETURN v_result;
  END IF;
  
  -- Try to find user in students table
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url
  INTO v_user_record
  FROM students 
  WHERE email = p_identifier AND (
    password_hash = p_password OR 
    (password_hash IS NULL AND p_password = '123') OR
    (password_hash = '' AND p_password = '123')
  );
  
  IF FOUND THEN
    SELECT json_build_object(
      'success', true,
      'role', 'student',
      'token', 'student-token-' || v_user_record.id,
      'name', v_user_record.name,
      'email', v_user_record.email,
      'student_id', v_user_record.id,
      'is_verified', v_user_record.is_verified,
      'personal_email', v_user_record.personal_email,
      'photo_url', v_user_record.photo_url
    ) INTO v_result;
    RETURN v_result;
  END IF;
  
  -- No user found
  SELECT json_build_object(
    'success', false,
    'message', 'Invalid credentials'
  ) INTO v_result;
  
  RETURN v_result;
END;
$function$