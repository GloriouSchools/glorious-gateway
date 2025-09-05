-- Create admin user profile and role
-- This assumes the admin user will sign up with admin@glorious.com
-- First, let's create a trigger to automatically assign admin role when admin@glorious.com signs up

CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user is the admin
  IF new.email = 'admin@glorious.com' THEN
    -- Update the profile with admin name
    UPDATE public.profiles
    SET full_name = 'System Administrator'
    WHERE id = new.id;
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN new;
END;
$$;

-- Create trigger to handle admin signup
CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (new.email = 'admin@glorious.com')
  EXECUTE FUNCTION public.handle_admin_signup();

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_login(input_email text, input_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow this specific admin login
  RETURN input_email = 'admin@glorious.com' AND input_password = 'Glorious@15';
END;
$$;