-- Update TEACHERS table to match students/admins structure
ALTER TABLE public."TEACHERS" 
ADD COLUMN IF NOT EXISTS id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
ADD COLUMN IF NOT EXISTS personal_email TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS teacher_id TEXT;

-- Update column names to match convention (if they don't exist already)
ALTER TABLE public."TEACHERS" 
RENAME COLUMN photo TO photo_url;

-- Ensure teachers table has proper timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on teachers
DROP TRIGGER IF EXISTS update_teachers_updated_at ON public."TEACHERS";
CREATE TRIGGER update_teachers_updated_at
    BEFORE UPDATE ON public."TEACHERS"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on teachers table
ALTER TABLE public."TEACHERS" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teachers (similar to students)
CREATE POLICY "Teachers can view their own data" 
ON public."TEACHERS" 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Teachers can update their own data" 
ON public."TEACHERS" 
FOR UPDATE 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Update the verify_flexible_login function to work with the updated teachers table
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
  
  -- Check teachers table (updated to use new structure)
  SELECT id, name, email, password_hash, is_verified, personal_email, photo_url, teacher_id
  INTO v_user_record
  FROM "TEACHERS" 
  WHERE lower(trim(email)) = lower(trim(p_identifier)) OR teacher_id = p_identifier OR id = p_identifier;
  
  IF FOUND THEN
    v_user_type := 'teacher';
    -- For teachers: allow default password if no password_hash is set, or match the stored password
    IF (coalesce(v_user_record.password_hash, '') = '' AND trim(p_password) = 'teacher123') 
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
    -- For admins: allow default password if no password_hash is set, or match the stored password
    IF (coalesce(v_user_record.password_hash, '') = '' AND trim(p_password) = 'admin123') 
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