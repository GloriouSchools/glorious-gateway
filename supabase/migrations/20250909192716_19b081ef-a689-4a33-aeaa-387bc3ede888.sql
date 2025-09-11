-- Function to verify flexible login (handles all user types)
CREATE OR REPLACE FUNCTION verify_flexible_login(
  p_identifier TEXT,
  p_password TEXT
)
RETURNS JSON AS $$
DECLARE
  v_user_record RECORD;
  v_result JSON;
BEGIN
  -- Try to find user in admins table
  SELECT id, name, email, password_hash, is_verified, personal_email
  INTO v_user_record
  FROM admins 
  WHERE email = p_identifier AND password_hash = p_password;
  
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
  WHERE email = p_identifier AND password_hash::text = p_password;
  
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
  WHERE email = p_identifier AND password_hash = p_password;
  
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify user account after email verification
CREATE OR REPLACE FUNCTION verify_user_account(
  p_user_type TEXT,
  p_user_id TEXT,
  p_personal_email TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  IF p_user_type = 'admin' THEN
    UPDATE admins 
    SET is_verified = true, personal_email = p_personal_email
    WHERE id = p_user_id;
    RETURN FOUND;
  ELSIF p_user_type = 'teacher' THEN
    UPDATE teachers 
    SET is_verified = true, personal_email = p_personal_email
    WHERE id = p_user_id;
    RETURN FOUND;
  ELSIF p_user_type = 'student' THEN
    UPDATE students 
    SET is_verified = true, personal_email = p_personal_email
    WHERE id = p_user_id;
    RETURN FOUND;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;