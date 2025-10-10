-- Create attendance status enum
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- Create attendance table
CREATE TABLE public.attendance (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT NOT NULL,
  class_id TEXT,
  stream_id TEXT,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'absent',
  notes TEXT,
  marked_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_class_id ON public.attendance(class_id);
CREATE INDEX idx_attendance_stream_id ON public.attendance(stream_id);
CREATE INDEX idx_attendance_status ON public.attendance(status);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policy for reading attendance (everyone can read)
CREATE POLICY "Allow public read access to attendance"
  ON public.attendance FOR SELECT
  USING (true);

-- Create policy for inserting attendance (authenticated users can insert)
CREATE POLICY "Allow authenticated users to insert attendance"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for updating attendance (authenticated users can update)
CREATE POLICY "Allow authenticated users to update attendance"
  ON public.attendance FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy for deleting attendance (authenticated users can delete)
CREATE POLICY "Allow authenticated users to delete attendance"
  ON public.attendance FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();