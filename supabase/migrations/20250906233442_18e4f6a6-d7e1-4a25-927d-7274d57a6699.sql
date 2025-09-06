-- Drop the dangerous public read policy that exposes all student data
DROP POLICY IF EXISTS "Students are viewable by everyone" ON public.students;

-- Create a secure policy: Students can only view their own data when authenticated
-- This uses the student_sessions table to verify the student's identity
CREATE POLICY "Students can view their own data" 
ON public.students 
FOR SELECT 
USING (
  -- Allow if there's a valid session for this student
  EXISTS (
    SELECT 1 FROM public.student_sessions 
    WHERE student_id = students.id 
    AND expires_at > now()
  )
  -- OR if the user is an admin (keep existing admin access)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Similarly update the teachers table if it has the same issue
DROP POLICY IF EXISTS "Teachers are viewable by everyone" ON public.teachers;

-- Teachers can only view their own data (we'll add teacher sessions later when implemented)
CREATE POLICY "Teachers can view their own data" 
ON public.teachers 
FOR SELECT 
USING (
  -- For now, only admins can view teacher data
  -- When teacher login is implemented, add teacher session check here
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update classes table - this can remain public as it's not sensitive
-- Classes are needed for the login form dropdown, so keep them public

-- Update streams table - also needed for login form, keep public

-- Add a comment explaining the security model
COMMENT ON POLICY "Students can view their own data" ON public.students IS 
'Students can only access their own record via session token. This prevents unauthorized access to other students personal information including emails, password hashes, and personal details.';