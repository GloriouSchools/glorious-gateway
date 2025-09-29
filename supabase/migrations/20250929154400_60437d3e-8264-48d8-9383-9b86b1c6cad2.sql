-- Update all default_password values to be 4-digit padded strings
UPDATE students 
SET default_password = lpad(default_password::text, 4, '0')::bigint 
WHERE default_password IS NOT NULL;

-- Clear default_password only for students who have set a password_hash
UPDATE students 
SET default_password = NULL 
WHERE password_hash IS NOT NULL AND password_hash != '';

-- Create or replace the trigger function to only clear default_password when password_hash is set
CREATE OR REPLACE FUNCTION public.clear_default_password_on_hash_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- If password_hash is being set and is not null/empty, clear the default_password
  IF NEW.password_hash IS NOT NULL AND NEW.password_hash != '' THEN
    NEW.default_password = NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for password updates (only on UPDATE since we handle INSERT manually)
DROP TRIGGER IF EXISTS clear_default_password_trigger ON public.students;
CREATE TRIGGER clear_default_password_trigger
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.clear_default_password_on_hash_update();