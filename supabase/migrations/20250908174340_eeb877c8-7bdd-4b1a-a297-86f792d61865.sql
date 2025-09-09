-- Update the verify_flexible_login function to return photo_url for students
CREATE OR REPLACE FUNCTION public.verify_flexible_login(p_identifier text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_admin RECORD;
  v_teacher RECORD;
  v_student RECORD;
  v_result JSON;
BEGIN
  -- First, try to find admin by email
  BEGIN
    SELECT * INTO v_admin
    FROM public.admins
    WHERE email = p_identifier;
    
    IF FOUND THEN
      -- Check admin password (plaintext for now)
      IF v_admin.password_hash = p_password THEN
        v_result := json_build_object(
          'success', true,
          'user_type', 'admin',
          'email', v_admin.email,
          'name', v_admin.name,
          'is_verified', v_admin.is_verified,
          'personal_email', v_admin.personal_email,
          'role', 'admin',
          'token', v_admin.id::text
        );
        RETURN v_result;
      ELSE
        v_result := json_build_object('success', false, 'message', 'Invalid credentials');
        RETURN v_result;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Continue to next check if admin query fails
    NULL;
  END;
  
  -- Then, try to find teacher by email or teacher_id
  BEGIN
    SELECT * INTO v_teacher
    FROM public.teachers
    WHERE email = p_identifier OR teacher_id = p_identifier;
    
    IF FOUND THEN
      -- Check teacher password
      IF v_teacher.password_hash IS NULL OR v_teacher.password_hash = '' THEN
        -- No custom password set, check if using default password "123"
        IF p_password = '123' THEN
          v_result := json_build_object(
            'success', true,
            'user_type', 'teacher',
            'teacher_id', v_teacher.teacher_id,
            'email', v_teacher.email,
            'name', v_teacher.name,
            'is_verified', v_teacher.is_verified,
            'personal_email', v_teacher.personal_email,
            'role', 'teacher',
            'token', v_teacher.id::text
          );
          RETURN v_result;
        ELSE
          v_result := json_build_object('success', false, 'message', 'Invalid credentials');
          RETURN v_result;
        END IF;
      ELSE
        -- Custom password is set, check against stored password
        IF v_teacher.password_hash = p_password THEN
          v_result := json_build_object(
            'success', true,
            'user_type', 'teacher',
            'teacher_id', v_teacher.teacher_id,
            'email', v_teacher.email,
            'name', v_teacher.name,
            'is_verified', v_teacher.is_verified,
            'personal_email', v_teacher.personal_email,
            'role', 'teacher',
            'token', v_teacher.id::text
          );
          RETURN v_result;
        ELSE
          v_result := json_build_object('success', false, 'message', 'Invalid credentials');
          RETURN v_result;
        END IF;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Continue to next check if teacher query fails
    NULL;
  END;
  
  -- Finally, try to find student by email only (since student_id column doesn't exist)
  BEGIN
    SELECT * INTO v_student
    FROM public.students
    WHERE email = p_identifier;
    
    IF FOUND THEN
      -- Check student password
      IF v_student.password_hash IS NULL OR v_student.password_hash = '' THEN
        -- No custom password set, check if using default password "123"
        IF p_password = '123' THEN
          v_result := json_build_object(
            'success', true,
            'user_type', 'student',
            'student_id', v_student.id,
            'email', v_student.email,
            'name', v_student.name,
            'is_verified', v_student.is_verified,
            'personal_email', v_student.personal_email,
            'photo_url', v_student.photo_url,
            'role', 'student',
            'token', v_student.id::text
          );
          RETURN v_result;
        ELSE
          v_result := json_build_object('success', false, 'message', 'Invalid credentials');
          RETURN v_result;
        END IF;
      ELSE
        -- Custom password is set, check against stored password
        IF v_student.password_hash = p_password THEN
          v_result := json_build_object(
            'success', true,
            'user_type', 'student',
            'student_id', v_student.id,
            'email', v_student.email,
            'name', v_student.name,
            'is_verified', v_student.is_verified,
            'personal_email', v_student.personal_email,
            'photo_url', v_student.photo_url,
            'role', 'student',
            'token', v_student.id::text
          );
          RETURN v_result;
        ELSE
          v_result := json_build_object('success', false, 'message', 'Invalid credentials');
          RETURN v_result;
        END IF;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Continue if student query fails
    NULL;
  END;
  
  -- If no user found in any table
  v_result := json_build_object('success', false, 'message', 'User not found');
  RETURN v_result;
END;
$function$;