-- Clean up incorrect class and stream data only

-- Delete incorrect classes (Primary 1, Primary 2, Primary 3, Primary 4)
DELETE FROM public.classes 
WHERE name IN ('Primary 1', 'Primary 2', 'Primary 3', 'Primary 4');

-- Delete incorrect streams (Stream A, Stream B)
DELETE FROM public.streams 
WHERE name IN ('Stream A', 'Stream B');

-- Drop only the irrelevant tables (keeping functions and types as they're used by RLS)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;