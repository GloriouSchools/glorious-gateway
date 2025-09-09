-- Create a simple test function to debug access
CREATE OR REPLACE FUNCTION public.test_admin_access(p_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_admin RECORD;
  v_count INTEGER;
BEGIN
  -- Count all admins
  SELECT COUNT(*) INTO v_count FROM public.admins;
  
  -- Try to select the specific admin
  SELECT * INTO v_admin FROM public.admins WHERE email = p_email;
  
  RETURN json_build_object(
    'total_admins', v_count,
    'found_admin', CASE WHEN v_admin IS NOT NULL THEN true ELSE false END,
    'admin_email', v_admin.email,
    'admin_name', v_admin.name
  );
END;
$function$;