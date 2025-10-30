-- Update default_password to have leading zeros (4 digits) for non-NULL values
UPDATE students
SET default_password = LPAD(default_password, 4, '0')
WHERE default_password IS NOT NULL 
  AND default_password != ''
  AND LENGTH(default_password) < 4;