-- Change default_password column from bigint to text to support 4-digit format with leading zeros
ALTER TABLE students 
ALTER COLUMN default_password TYPE text 
USING LPAD(default_password::text, 4, '0');

-- Update any existing passwords to ensure they are 4 digits with leading zeros
UPDATE students 
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL;

-- Add a check to ensure default_password is always 4 digits if provided
ALTER TABLE students 
ADD CONSTRAINT check_default_password_format 
CHECK (default_password IS NULL OR (default_password ~ '^[0-9]{4}$'));