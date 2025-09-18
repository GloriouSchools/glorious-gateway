-- Update students table to use text for default_password to preserve leading zeros
ALTER TABLE public.students 
ALTER COLUMN default_password TYPE text USING LPAD(default_password::text, 4, '0');

-- Add a check constraint to ensure passwords are 4 digits
ALTER TABLE public.students 
ADD CONSTRAINT check_default_password_format 
CHECK (default_password ~ '^[0-9]{4}$');

-- Update existing passwords to have leading zeros format
UPDATE public.students 
SET default_password = LPAD(COALESCE(default_password, '1')::text, 4, '0')
WHERE default_password IS NOT NULL;