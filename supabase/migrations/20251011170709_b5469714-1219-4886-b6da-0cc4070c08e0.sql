-- Add absent_reason column to attendance_records table
ALTER TABLE public.attendance_records
ADD COLUMN IF NOT EXISTS absent_reason TEXT;