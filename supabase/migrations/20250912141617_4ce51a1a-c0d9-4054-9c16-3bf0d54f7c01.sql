-- Fix the streams table and properly update IDs to meaningful identifiers

-- First, let's clean up the previous attempt and restore functionality
-- Drop the columns we added that may have caused issues
ALTER TABLE public.classes DROP COLUMN IF EXISTS new_id;
ALTER TABLE public.streams DROP COLUMN IF EXISTS new_class_id;
ALTER TABLE public.streams DROP COLUMN IF EXISTS new_id;
ALTER TABLE public.students DROP COLUMN IF EXISTS new_class_id;
ALTER TABLE public.students DROP COLUMN IF EXISTS new_stream_id;

-- Ensure streams has proper ID if missing
UPDATE public.streams SET id = gen_random_uuid()::text WHERE id IS NULL;

-- Now let's do this step by step more carefully
-- Step 1: Create mapping tables to track old and new IDs
CREATE TEMP TABLE class_mapping AS
SELECT 
  id as old_id, 
  'P' || ROW_NUMBER() OVER (ORDER BY created_at, name) as new_id
FROM public.classes;

CREATE TEMP TABLE stream_mapping AS
SELECT 
  s.id as old_id,
  cm.new_id || '-S' || ROW_NUMBER() OVER (PARTITION BY cm.new_id ORDER BY s.created_at, s.name) as new_id
FROM public.streams s
JOIN public.classes c ON s.class_id = c.id
JOIN class_mapping cm ON c.id = cm.old_id;

-- Step 2: Update all references first
-- Update students.class_id
UPDATE public.students 
SET class_id = cm.new_id
FROM class_mapping cm 
WHERE public.students.class_id = cm.old_id;

-- Update students.stream_id  
UPDATE public.students 
SET stream_id = sm.new_id
FROM stream_mapping sm 
WHERE public.students.stream_id = sm.old_id;

-- Update streams.class_id
UPDATE public.streams 
SET class_id = cm.new_id
FROM class_mapping cm 
WHERE public.streams.class_id = cm.old_id;

-- Step 3: Update the primary keys
-- Update streams.id
UPDATE public.streams 
SET id = sm.new_id
FROM stream_mapping sm 
WHERE public.streams.id = sm.old_id;

-- Update classes.id (do this last since it's referenced by streams)
UPDATE public.classes 
SET id = cm.new_id
FROM class_mapping cm 
WHERE public.classes.id = cm.old_id;