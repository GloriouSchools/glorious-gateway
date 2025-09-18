-- Update default passwords to be 4-digit format with leading zeros
UPDATE public.students 
SET default_password = LPAD(default_password::TEXT, 4, '0')::BIGINT
WHERE default_password IS NOT NULL;