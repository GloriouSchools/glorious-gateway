-- Change teachers default_password from bigint to text for consistency
ALTER TABLE public.teachers 
ALTER COLUMN default_password TYPE text;

-- Update existing teachers default_password values to 4-digit text format
UPDATE public.teachers 
SET default_password = LPAD(COALESCE(default_password::text, ''), 4, '0')
WHERE default_password IS NOT NULL;

-- Add check constraint for 4-digit format
ALTER TABLE public.teachers
ADD CONSTRAINT teachers_default_password_format 
CHECK (default_password ~ '^\d{4}$');