-- Grant necessary permissions to the function owner for table access
GRANT SELECT ON public.admins TO postgres;
GRANT SELECT ON public.teachers TO postgres;
GRANT SELECT ON public.students TO postgres;

-- Also ensure the function can be called by anon users
GRANT EXECUTE ON FUNCTION public.verify_flexible_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_flexible_login(text, text) TO authenticated;