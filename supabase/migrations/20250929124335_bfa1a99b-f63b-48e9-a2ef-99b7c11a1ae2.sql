-- Update default_password column to be 4-character strings with leading zeros
-- First, change the column type to text
ALTER TABLE public.students ALTER COLUMN default_password TYPE text USING LPAD(default_password::text, 4, '0');

-- Update all existing records to have 4-character format with leading zeros
UPDATE public.students 
SET default_password = LPAD(default_password, 4, '0')
WHERE LENGTH(default_password) < 4;