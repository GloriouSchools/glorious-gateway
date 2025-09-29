-- Create policies for login functionality on students table
CREATE POLICY "Allow login access to students" 
ON public.students 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create policies for login functionality on teachers table  
CREATE POLICY "Allow login access to teachers"
ON public.teachers
FOR SELECT
TO anon, authenticated  
USING (true);

-- Create policies for login functionality on admins table
CREATE POLICY "Allow login access to admins"
ON public.admins
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policies for login functionality on classes table
CREATE POLICY "Allow read access to classes"
ON public.classes
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policies for login functionality on streams table
CREATE POLICY "Allow read access to streams"
ON public.streams
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policies for electoral_applications table
CREATE POLICY "Allow read access to electoral_applications"
ON public.electoral_applications
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policies for electoral_positions table
CREATE POLICY "Allow read access to electoral_positions"
ON public.electoral_positions
FOR SELECT
TO anon, authenticated
USING (true);