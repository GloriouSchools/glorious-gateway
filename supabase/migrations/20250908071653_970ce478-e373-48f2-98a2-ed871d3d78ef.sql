-- Create admins table
CREATE TABLE public.admins (
    id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    personal_email text,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create teachers table  
CREATE TABLE public.teachers (
    id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
    teacher_id text UNIQUE NOT NULL,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text,
    personal_email text,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins
CREATE POLICY "Admins can view their own record" 
ON public.admins 
FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Admins can update their own record" 
ON public.admins 
FOR UPDATE 
USING (auth.uid()::text = id);

-- Create RLS policies for teachers
CREATE POLICY "Teachers can view their own record" 
ON public.teachers 
FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Teachers can update their own record" 
ON public.teachers 
FOR UPDATE 
USING (auth.uid()::text = id);

CREATE POLICY "Admins can manage all teachers" 
ON public.teachers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all admins" 
ON public.admins 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert admin data
INSERT INTO public.admins (name, email, password_hash, is_verified) 
VALUES ('School Administrator', 'admin@glorious.com', 'Glorious@15', true);

-- Insert some dummy teacher data
INSERT INTO public.teachers (teacher_id, name, email, password_hash, is_verified) VALUES
('TCH001', 'Sarah Johnson', 'sarah.johnson@glorious.com', '123', false),
('TCH002', 'Michael Brown', 'michael.brown@glorious.com', '123', false),
('TCH003', 'Emily Davis', 'emily.davis@glorious.com', '123', false),
('TCH004', 'David Wilson', 'david.wilson@glorious.com', '123', false);

-- Add some dummy class data
INSERT INTO public.classes (name, description) VALUES
('Primary 1', 'First year primary education'),
('Primary 2', 'Second year primary education'),
('Primary 3', 'Third year primary education'),
('Primary 4', 'Fourth year primary education');

-- Add some dummy stream data (getting class IDs first)
INSERT INTO public.streams (name, description, class_id) VALUES
('Stream A', 'Primary 1 Stream A', (SELECT id FROM public.classes WHERE name = 'Primary 1' LIMIT 1)),
('Stream B', 'Primary 1 Stream B', (SELECT id FROM public.classes WHERE name = 'Primary 1' LIMIT 1)),
('Stream A', 'Primary 2 Stream A', (SELECT id FROM public.classes WHERE name = 'Primary 2' LIMIT 1)),
('Stream B', 'Primary 2 Stream B', (SELECT id FROM public.classes WHERE name = 'Primary 2' LIMIT 1));