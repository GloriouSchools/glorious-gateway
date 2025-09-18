-- Update photo_url for P4 students that have null values
UPDATE students 
SET photo_url = 'https://fresh-teacher.github.io/gloriouschool/' || name || '.JPG'
WHERE class_id = 'P4' AND photo_url IS NULL;