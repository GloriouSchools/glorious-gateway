-- Update photos for KALIBBALA JANAT and NAKASUJJA SHANNAH

UPDATE electoral_applications 
SET student_photo = '/janat.jpg'
WHERE student_name ILIKE '%KALIBBALA JANAT%' OR student_name ILIKE '%JANAT%KALIBBALA%';

UPDATE electoral_applications 
SET student_photo = '/shannah.jpg'
WHERE student_name ILIKE '%NAKASUJJA SHANNAH%' OR student_name ILIKE '%SHANNAH%NAKASUJJA%';
