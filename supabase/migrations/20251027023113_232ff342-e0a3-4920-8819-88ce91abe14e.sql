-- Fix NULL IDs in electoral_applications
UPDATE electoral_applications 
SET id = gen_random_uuid()::text 
WHERE id IS NULL;

-- Ensure id column is never null going forward
ALTER TABLE electoral_applications 
ALTER COLUMN id SET NOT NULL;

-- Set default value for id column
ALTER TABLE electoral_applications 
ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;