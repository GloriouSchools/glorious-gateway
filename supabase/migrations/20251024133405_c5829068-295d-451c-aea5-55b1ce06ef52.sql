-- Change default_password columns from bigint to text to support leading zeros (0001, 0078, etc.)

-- Update students table
ALTER TABLE public.students 
ALTER COLUMN default_password TYPE text USING default_password::text;

-- Update teachers table
ALTER TABLE public.teachers 
ALTER COLUMN default_password TYPE text USING default_password::text;