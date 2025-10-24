-- Update existing default_password values to have leading zeros (4 digits)

-- Update students table
UPDATE public.students 
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL AND LENGTH(default_password) < 4;

-- Update teachers table
UPDATE public.teachers 
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL AND LENGTH(default_password) < 4;