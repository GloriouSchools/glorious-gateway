-- Enforce one application per student account
ALTER TABLE public.electoral_applications
ADD CONSTRAINT electoral_applications_student_id_unique UNIQUE (student_id);