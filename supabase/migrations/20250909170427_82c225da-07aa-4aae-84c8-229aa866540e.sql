-- Fix the password_hash column type in teachers table to be consistent with other tables
ALTER TABLE public.teachers ALTER COLUMN password_hash TYPE TEXT;