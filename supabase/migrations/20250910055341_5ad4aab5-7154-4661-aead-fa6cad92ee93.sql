-- Create the verify_flexible_login function that matches the edge function expectations
CREATE OR REPLACE FUNCTION public.verify_flexible_login(
  p_identifier text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_record RECORD;
  v_user_type text;
  v_result json;
BEGIN
  -- First check students table
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url, class_id, stream_id
  INTO v_user_record
  FROM students 
  WHERE email = p_identifier OR id = p_identifier;
  
  IF FOUND THEN
    v_user_type := 'student';
  ELSE
    -- Check teachers table
    SELECT id, name, email, password_hash, is_verified, personal_email, teacher_id
    INTO v_user_record
    FROM teachers 
    WHERE email = p_identifier OR teacher_id = p_identifier OR id = p_identifier;
    
    IF FOUND THEN
      v_user_type := 'teacher';
    ELSE
      -- Check admins table
      SELECT id, name, email, password_hash, is_verified, personal_email
      INTO v_user_record
      FROM admins 
      WHERE email = p_identifier OR id = p_identifier;
      
      IF FOUND THEN
        v_user_type := 'admin';
      ELSE
        -- User not found
        RETURN json_build_object(
          'success', false,
          'message', 'User not found'
        );
      END IF;
    END IF;
  END IF;
  
  -- Verify password (in production, you'd use proper password hashing)
  IF v_user_record.password_hash = p_password THEN
    -- Build success response with user data
    v_result := json_build_object(
      'success', true,
      'user_type', v_user_type,
      'user_data', row_to_json(v_user_record)
    );
  ELSE
    -- Invalid password
    v_result := json_build_object(
      'success', false,
      'message', 'Invalid credentials'
    );
  END IF;
  
  RETURN v_result;
END;
$$;