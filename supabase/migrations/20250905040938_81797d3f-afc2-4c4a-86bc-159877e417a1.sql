-- Create a proper admin user in the auth system
-- This creates a real user that can be authenticated

-- First, let's create a function to set up the admin user
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Generate a consistent UUID for the admin
  admin_uid := '00000000-0000-0000-0000-000000000001'::uuid;
  
  -- Check if admin already exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_uid) THEN
    -- Create admin profile
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (admin_uid, 'System Administrator', 'admin@glorious.com');
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_uid, 'admin'::app_role);
  END IF;
END;
$$;

-- Execute the function to create the admin
SELECT public.create_admin_user();

-- Update the verify_admin_login function to return the admin UUID
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email text, input_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow this specific admin login
  IF input_email = 'admin@glorious.com' AND input_password = 'Glorious@15' THEN
    RETURN '00000000-0000-0000-0000-000000000001'::uuid;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;