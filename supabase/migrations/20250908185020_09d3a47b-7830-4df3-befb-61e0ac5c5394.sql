-- Create a function to get table counts for admin dashboard
CREATE OR REPLACE FUNCTION public.get_table_count(table_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result integer;
BEGIN
  -- Safely get count from specified table
  CASE table_name
    WHEN 'students' THEN
      SELECT COUNT(*) INTO result FROM public.students;
    WHEN 'teachers' THEN
      SELECT COUNT(*) INTO result FROM public.teachers;
    WHEN 'classes' THEN
      SELECT COUNT(*) INTO result FROM public.classes;
    WHEN 'streams' THEN
      SELECT COUNT(*) INTO result FROM public.streams;
    ELSE
      result := 0;
  END CASE;
  
  RETURN result;
END;
$$;