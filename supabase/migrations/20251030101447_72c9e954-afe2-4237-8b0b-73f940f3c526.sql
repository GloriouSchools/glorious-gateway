-- Clear password_hash for all teachers (it will be set when they change their password)
UPDATE public.teachers SET password_hash = NULL;