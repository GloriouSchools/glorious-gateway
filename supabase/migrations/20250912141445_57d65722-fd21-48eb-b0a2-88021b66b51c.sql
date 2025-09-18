-- Update class and stream IDs to use meaningful identifiers

-- First, let's create a mapping for classes (P1, P2, etc.)
-- We'll create temporary columns to store the new IDs
ALTER TABLE public.classes ADD COLUMN new_id TEXT;
ALTER TABLE public.streams ADD COLUMN new_class_id TEXT;
ALTER TABLE public.streams ADD COLUMN new_id TEXT;
ALTER TABLE public.students ADD COLUMN new_class_id TEXT;
ALTER TABLE public.students ADD COLUMN new_stream_id TEXT;

-- Update classes with meaningful IDs (P1, P2, P3, etc.)
WITH numbered_classes AS (
  SELECT id, 'P' || ROW_NUMBER() OVER (ORDER BY created_at, name) as new_class_id
  FROM public.classes
)
UPDATE public.classes 
SET new_id = numbered_classes.new_class_id
FROM numbered_classes 
WHERE public.classes.id = numbered_classes.id;

-- Update streams table with new class references
UPDATE public.streams 
SET new_class_id = classes.new_id
FROM public.classes 
WHERE public.streams.class_id = public.classes.id;

-- Update streams with meaningful IDs (P1-S1, P1-S2, etc.)
WITH numbered_streams AS (
  SELECT 
    id, 
    new_class_id || '-S' || ROW_NUMBER() OVER (PARTITION BY new_class_id ORDER BY created_at, name) as new_stream_id
  FROM public.streams
)
UPDATE public.streams 
SET new_id = numbered_streams.new_stream_id
FROM numbered_streams 
WHERE public.streams.id = numbered_streams.id;

-- Update students table with new class and stream references
UPDATE public.students 
SET new_class_id = classes.new_id
FROM public.classes 
WHERE public.students.class_id = public.classes.id;

UPDATE public.students 
SET new_stream_id = streams.new_id
FROM public.streams 
WHERE public.students.stream_id = public.streams.id;

-- Now swap the columns
-- Classes table
ALTER TABLE public.classes DROP COLUMN id;
ALTER TABLE public.classes RENAME COLUMN new_id TO id;
ALTER TABLE public.classes ADD PRIMARY KEY (id);

-- Streams table
ALTER TABLE public.streams DROP COLUMN class_id;
ALTER TABLE public.streams DROP COLUMN id;
ALTER TABLE public.streams RENAME COLUMN new_class_id TO class_id;
ALTER TABLE public.streams RENAME COLUMN new_id TO id;
ALTER TABLE public.streams ADD PRIMARY KEY (id);

-- Students table  
ALTER TABLE public.students DROP COLUMN class_id;
ALTER TABLE public.students DROP COLUMN stream_id;
ALTER TABLE public.students RENAME COLUMN new_class_id TO class_id;
ALTER TABLE public.students RENAME COLUMN new_stream_id TO stream_id;

-- Remove the UUID default from streams id column since we're not using UUIDs anymore
ALTER TABLE public.streams ALTER COLUMN id DROP DEFAULT;