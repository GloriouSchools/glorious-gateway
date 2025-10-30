-- Update existing student passwords to 4-digit format with leading zeros
UPDATE students
SET default_password = LPAD(COALESCE(default_password, '0'), 4, '0')
WHERE default_password IS NOT NULL 
  AND LENGTH(default_password) < 4;