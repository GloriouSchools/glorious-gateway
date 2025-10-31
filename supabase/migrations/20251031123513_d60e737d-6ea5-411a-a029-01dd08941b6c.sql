-- Fix attendance_records table structure
-- Add primary key to id column and unique constraint for upsert
ALTER TABLE public.attendance_records 
  ALTER COLUMN id SET DEFAULT gen_random_uuid()::text,
  ALTER COLUMN id SET NOT NULL;

-- Add primary key constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_records_pkey'
  ) THEN
    ALTER TABLE public.attendance_records ADD PRIMARY KEY (id);
  END IF;
END $$;

-- Add unique constraint on student_id and date for upsert functionality
ALTER TABLE public.attendance_records 
  DROP CONSTRAINT IF EXISTS attendance_records_student_date_unique;

ALTER TABLE public.attendance_records 
  ADD CONSTRAINT attendance_records_student_date_unique 
  UNIQUE (student_id, date);

-- Add RLS policies for insert and update
CREATE POLICY "Allow authenticated users to insert attendance"
ON public.attendance_records
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update attendance"
ON public.attendance_records
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);