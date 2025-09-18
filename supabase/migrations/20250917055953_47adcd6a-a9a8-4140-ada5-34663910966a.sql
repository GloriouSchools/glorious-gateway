-- Ensure students are visible and default_passwords are 4-digit strings
BEGIN;

-- 1) Enable RLS on students (safe to run multiple times)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 2) Allow public read access to students
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'students' 
      AND policyname = 'Users can read students'
  ) THEN
    CREATE POLICY "Users can read students"
    ON public.students
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- 3) Change default_password to text and zero-pad to at least 4 digits
ALTER TABLE public.students
  ALTER COLUMN default_password TYPE text
  USING (
    CASE 
      WHEN default_password IS NULL THEN NULL
      ELSE lpad(default_password::text, 4, '0')
    END
  );

-- 4) Enforce that default_password is only digits and at least 4 characters
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_default_password_digits_chk;
ALTER TABLE public.students
  ADD CONSTRAINT students_default_password_digits_chk
  CHECK (default_password IS NULL OR default_password ~ '^[0-9]{4,}$');

COMMIT;