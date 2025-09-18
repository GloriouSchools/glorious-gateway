-- Change default_password column from BIGINT to TEXT to preserve leading zeros
ALTER TABLE public.students ALTER COLUMN default_password TYPE TEXT USING LPAD(default_password::TEXT, 4, '0');

-- Update any existing passwords to ensure 4-digit format
UPDATE public.students 
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL AND LENGTH(default_password) < 4;