-- Create admin user with predefined credentials
-- First, create the admin user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  aud,
  role,
  instance_id
) VALUES (
  gen_random_uuid(),
  'admin@glorious.com',
  crypt('Glorious@15', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator", "role": "admin"}',
  now(),
  now(),
  '',
  'authenticated',
  'authenticated',
  '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (email) DO NOTHING;