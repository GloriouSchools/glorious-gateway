-- Update the verify_flexible_login function to use consistent default password for all user types
CREATE OR REPLACE FUNCTION public.verify_flexible_login(p_identifier text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_record RECORD;
  v_user_type text;
  v_result json;
BEGIN
  -- Trim and validate inputs
  IF coalesce(trim(p_identifier), '') = '' OR coalesce(trim(p_password), '') = '' THEN
    RETURN json_build_object('success', false, 'message', 'Email and password are required');
  END IF;

  -- First check students table
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url, class_id, stream_id
  INTO v_user_record
  FROM students 
  WHERE lower(trim(email)) = lower(trim(p_identifier)) OR id = p_identifier;
  
  IF FOUND THEN
    v_user_type := 'student';
    -- For students: allow "123" as default password if no password_hash is set, or match the stored password
    IF (coalesce(v_user_record.password_hash, '') = '' AND trim(p_password) = '123') 
       OR v_user_record.password_hash = p_password THEN
      RETURN json_build_object(
        'success', true,
        'user_type', v_user_type,
        'user_data', row_to_json(v_user_record)
      );
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid credentials');
    END IF;
  END IF;
  
  -- Check teachers table (updated to use same default password "123")
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url, teacher_id
  INTO v_user_record
  FROM "TEACHERS" 
  WHERE lower(trim(email)) = lower(trim(p_identifier)) OR teacher_id = p_identifier OR id = p_identifier;
  
  IF FOUND THEN
    v_user_type := 'teacher';
    -- For teachers: allow "123" as default password if no password_hash is set, or match the stored password
    IF (coalesce(v_user_record.password_hash, '') = '' AND trim(p_password) = '123') 
       OR v_user_record.password_hash = p_password THEN
      RETURN json_build_object(
        'success', true,
        'user_type', v_user_type,
        'user_data', row_to_json(v_user_record)
      );
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid credentials');
    END IF;
  END IF;
  
  -- Check admins table
  SELECT id, name, email, password_hash, is_verified, personal_email
  INTO v_user_record
  FROM admins 
  WHERE lower(trim(email)) = lower(trim(p_identifier)) OR id = p_identifier;
  
  IF FOUND THEN
    v_user_type := 'admin';
    -- For admins: allow "123" as default password if no password_hash is set, or match the stored password
    IF (coalesce(v_user_record.password_hash, '') = '' AND trim(p_password) = '123') 
       OR v_user_record.password_hash = p_password THEN
      RETURN json_build_object(
        'success', true,
        'user_type', v_user_type,
        'user_data', row_to_json(v_user_record)
      );
    ELSE
      RETURN json_build_object('success', false, 'message', 'Invalid credentials');
    END IF;
  END IF;
  
  -- User not found
  RETURN json_build_object('success', false, 'message', 'Invalid credentials');
END;
$function$;