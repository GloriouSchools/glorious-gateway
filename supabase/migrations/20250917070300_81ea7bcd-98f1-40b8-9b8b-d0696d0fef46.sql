-- Add missing fields to electoral_applications table
ALTER TABLE electoral_applications 
ADD COLUMN IF NOT EXISTS sex text,
ADD COLUMN IF NOT EXISTS age text,
ADD COLUMN IF NOT EXISTS class_teacher_name text,
ADD COLUMN IF NOT EXISTS class_teacher_tel text,
ADD COLUMN IF NOT EXISTS parent_name text,
ADD COLUMN IF NOT EXISTS parent_tel text;