-- Delete old streams associated with Form 1-4 classes
DELETE FROM public.streams 
WHERE class_id IN (
  SELECT id FROM public.classes 
  WHERE name IN ('Form 1', 'Form 2', 'Form 3', 'Form 4')
);

-- Delete students associated with Form 1-4 classes
DELETE FROM public.students 
WHERE class_id IN (
  SELECT id FROM public.classes 
  WHERE name IN ('Form 1', 'Form 2', 'Form 3', 'Form 4')
);

-- Delete teacher associations with Form 1-4 classes
DELETE FROM public.teacher_classes 
WHERE class_id IN (
  SELECT id FROM public.classes 
  WHERE name IN ('Form 1', 'Form 2', 'Form 3', 'Form 4')
);

-- Delete the Form 1-4 classes
DELETE FROM public.classes 
WHERE name IN ('Form 1', 'Form 2', 'Form 3', 'Form 4');