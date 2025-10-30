-- Create RLS policies for all tables to allow SELECT access

-- Students table policies
CREATE POLICY "Allow public read access to students"
ON students FOR SELECT
USING (true);

-- Teachers table policies
CREATE POLICY "Allow public read access to teachers"
ON teachers FOR SELECT
USING (true);

-- Classes table policies
CREATE POLICY "Allow public read access to classes"
ON classes FOR SELECT
USING (true);

-- Streams table policies
CREATE POLICY "Allow public read access to streams"
ON streams FOR SELECT
USING (true);

-- Electoral applications policies
CREATE POLICY "Allow public read access to electoral_applications"
ON electoral_applications FOR SELECT
USING (true);

-- Electoral rows policies
CREATE POLICY "Allow public read access to electoral_rows"
ON electoral_rows FOR SELECT
USING (true);

-- Electoral votes policies
CREATE POLICY "Allow public read access to electoral_votes"
ON electoral_votes FOR SELECT
USING (true);

-- Physical votes policies
CREATE POLICY "Allow public read access to physical_votes"
ON physical_votes FOR SELECT
USING (true);

-- Attendance records policies
CREATE POLICY "Allow public read access to attendance_records"
ON attendance_records FOR SELECT
USING (true);

-- Admins table policies
CREATE POLICY "Allow public read access to admins"
ON admins FOR SELECT
USING (true);