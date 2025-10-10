-- First, ensure students table has a proper primary key
-- Remove the constraint if it exists to avoid errors
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_pkey;

-- Add primary key constraint to students table
ALTER TABLE public.students 
  ADD CONSTRAINT students_pkey PRIMARY KEY (id);

-- Ensure streams table has a proper primary key
ALTER TABLE public.streams DROP CONSTRAINT IF EXISTS streams_pkey;

-- Add primary key constraint to streams table  
ALTER TABLE public.streams 
  ADD CONSTRAINT streams_pkey PRIMARY KEY (id);

-- Now create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  stream_id TEXT NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  marked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

COMMENT ON TABLE public.attendance_records IS 'Daily attendance records for students';

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view attendance records"
  ON public.attendance_records FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert attendance records"
  ON public.attendance_records FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update attendance records"
  ON public.attendance_records FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete attendance records"
  ON public.attendance_records FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_stream_id ON public.attendance_records(stream_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_date_stream ON public.attendance_records(date, stream_id);

CREATE OR REPLACE FUNCTION public.update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_attendance_updated_at();

GRANT ALL ON public.attendance_records TO authenticated;
GRANT ALL ON public.attendance_records TO service_role;