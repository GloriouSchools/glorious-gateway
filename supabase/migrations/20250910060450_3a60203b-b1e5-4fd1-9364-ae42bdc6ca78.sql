-- Create or replace the verify_flexible_login function to support default student password "123" when no password is set
CREATE OR REPLACE FUNCTION public.verify_flexible_login(p_identifier text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student RECORD;
  v_teacher RECORD;
  v_admin RECORD;
BEGIN
  IF coalesce(trim(p_identifier), '') = '' OR coalesce(trim(p_password), '') = '' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Email and password are required');
  END IF;

  -- Try student first
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url, class_id, stream_id
  INTO v_student
  FROM public.students
  WHERE lower(email) = lower(p_identifier)
  LIMIT 1;

  IF FOUND THEN
    IF ((coalesce(v_student.password_hash,'') = '' AND p_password = '123')
        OR v_student.password_hash = p_password) THEN
      RETURN jsonb_build_object(
        'success', true,
        'user_type', 'student',
        'user_data', jsonb_build_object(
          'id', v_student.id,
          'name', v_student.name,
          'email', v_student.email,
          'password_hash', v_student.password_hash,
          'is_verified', coalesce(v_student.is_verified, false),
          'personal_email', v_student.personal_email,
          'photo_url', v_student.photo_url,
          'class_id', v_student.class_id,
          'stream_id', v_student.stream_id
        )
      );
    END IF;
  END IF;

  -- Teacher
  SELECT id, name, email, password_hash, is_verified, personal_email, teacher_id
  INTO v_teacher
  FROM public.teachers
  WHERE lower(email) = lower(p_identifier)
  LIMIT 1;

  IF FOUND THEN
    IF v_teacher.password_hash = p_password THEN
      RETURN jsonb_build_object(
        'success', true,
        'user_type', 'teacher',
        'user_data', jsonb_build_object(
          'id', v_teacher.id,
          'name', v_teacher.name,
          'email', v_teacher.email,
          'password_hash', v_teacher.password_hash,
          'is_verified', coalesce(v_teacher.is_verified, false),
          'personal_email', v_teacher.personal_email,
          'teacher_id', v_teacher.teacher_id
        )
      );
    END IF;
  END IF;

  -- Admin
  SELECT id, name, email, password_hash, is_verified, personal_email
  INTO v_admin
  FROM public.admins
  WHERE lower(email) = lower(p_identifier)
  LIMIT 1;

  IF FOUND THEN
    IF v_admin.password_hash = p_password THEN
      RETURN jsonb_build_object(
        'success', true,
        'user_type', 'admin',
        'user_data', jsonb_build_object(
          'id', v_admin.id,
          'name', v_admin.name,
          'email', v_admin.email,
          'password_hash', v_admin.password_hash,
          'is_verified', coalesce(v_admin.is_verified, false),
          'personal_email', v_admin.personal_email
        )
      );
    END IF;
  END IF;

  RETURN jsonb_build_object('success', false, 'message', 'Invalid credentials');
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_flexible_login(text, text) TO anon, authenticated;