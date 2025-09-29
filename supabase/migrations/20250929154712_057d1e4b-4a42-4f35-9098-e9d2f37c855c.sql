-- Update the default_password field to store it as text with proper 4-digit formatting
-- First, let's change the column type to text to handle leading zeros properly
ALTER TABLE students ALTER COLUMN default_password TYPE text;

-- Now update all existing default passwords to be 4-digit strings with leading zeros
UPDATE students 
SET default_password = lpad(default_password, 4, '0')
WHERE default_password IS NOT NULL AND default_password != '';

-- Update the trigger function to handle the new text format
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