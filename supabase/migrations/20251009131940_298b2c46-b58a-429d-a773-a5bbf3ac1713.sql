-- Add default_password column to teachers table
ALTER TABLE public.teachers 
ADD COLUMN default_password text;

-- Populate default_password with last 4 digits of contactNumber
UPDATE public.teachers 
SET default_password = RIGHT("contactNumber"::text, 4)
WHERE "contactNumber" IS NOT NULL;

-- Add trigger to clear default_password when password_hash is updated
CREATE TRIGGER clear_teacher_default_password_on_hash_update
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.clear_default_password_on_hash_update();