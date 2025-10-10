-- Run this SQL in your Lovable Cloud SQL Editor to create the attendance_records table

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES public.streams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance_records
CREATE POLICY "Attendance records are viewable by authenticated users"
  ON public.attendance_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Attendance records can be inserted by authenticated users"
  ON public.attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Attendance records can be updated by authenticated users"
  ON public.attendance_records FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Attendance records can be deleted by authenticated users"
  ON public.attendance_records FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_stream_id ON public.attendance_records(stream_id);
