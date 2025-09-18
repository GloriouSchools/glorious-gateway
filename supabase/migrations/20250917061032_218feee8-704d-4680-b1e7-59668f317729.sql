-- Fix stream IDs for students to match the proper format
UPDATE students 
SET stream_id = 'P4-CUBS'
WHERE stream_id = 'CUBS';