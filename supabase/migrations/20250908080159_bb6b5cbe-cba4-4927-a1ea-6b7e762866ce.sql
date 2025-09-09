-- Clean up incorrect class and stream data

-- Delete incorrect classes (Primary 1, Primary 2, Primary 3, Primary 4)
DELETE FROM public.classes 
WHERE name IN ('Primary 1', 'Primary 2', 'Primary 3', 'Primary 4');

-- Delete incorrect streams (Stream A, Stream B)
DELETE FROM public.streams 
WHERE name IN ('Stream A', 'Stream B');

-- Drop profiles and user_roles tables as they are irrelevant for this app
-- (This app uses custom login system with separate admin/teacher/student tables)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the related function and enum as they're no longer needed
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP TYPE IF EXISTS public.app_role;