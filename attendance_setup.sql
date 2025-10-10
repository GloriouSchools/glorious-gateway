-- ============================================
-- ATTENDANCE RECORDS TABLE SETUP
-- Run this in Lovable Cloud SQL Editor
-- ============================================

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Add comment to table
COMMENT ON TABLE public.attendance_records IS 'Daily attendance records for students';

-- Enable Row Level Security
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Authenticated users can view attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can insert attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can update attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can delete attendance records" ON public.attendance_records;

-- RLS Policy: SELECT - All authenticated users can view attendance records
CREATE POLICY "Authenticated users can view attendance records"
  ON public.attendance_records
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: INSERT - All authenticated users can create attendance records
CREATE POLICY "Authenticated users can insert attendance records"
  ON public.attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policy: UPDATE - All authenticated users can update attendance records
CREATE POLICY "Authenticated users can update attendance records"
  ON public.attendance_records
  FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policy: DELETE - All authenticated users can delete attendance records
CREATE POLICY "Authenticated users can delete attendance records"
  ON public.attendance_records
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_date 
  ON public.attendance_records(date);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id 
  ON public.attendance_records(student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_stream_id 
  ON public.attendance_records(stream_id);

CREATE INDEX IF NOT EXISTS idx_attendance_status 
  ON public.attendance_records(status);

CREATE INDEX IF NOT EXISTS idx_attendance_date_stream 
  ON public.attendance_records(date, stream_id);

-- Grant permissions
GRANT ALL ON public.attendance_records TO authenticated;
GRANT ALL ON public.attendance_records TO service_role;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Attendance records table created successfully!';
END $$;
