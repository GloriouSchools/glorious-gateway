-- Fix the teachers table password_hash column type from bigint to text
ALTER TABLE public.teachers ALTER COLUMN password_hash TYPE text;