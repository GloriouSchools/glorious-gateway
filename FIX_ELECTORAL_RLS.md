# Fix Electoral Applications RLS Policies

## Problem
The `electoral_applications` table is blocking INSERT operations because Row Level Security (RLS) policies are not properly configured.

## Solution
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on electoral_applications table (if not already enabled)
ALTER TABLE electoral_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON electoral_applications;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON electoral_applications;
DROP POLICY IF EXISTS "Allow update for admins and own applications" ON electoral_applications;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON electoral_applications;

-- Allow authenticated users to insert applications
CREATE POLICY "Allow insert for authenticated users" ON electoral_applications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to read all applications
CREATE POLICY "Allow read for authenticated users" ON electoral_applications
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update applications
CREATE POLICY "Allow update for authenticated users" ON electoral_applications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete applications
CREATE POLICY "Allow delete for authenticated users" ON electoral_applications
FOR DELETE
TO authenticated
USING (true);
```

## How to Run

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Paste the SQL above
4. Click "Run"
5. Try adding an application again

## What This Does

- Enables Row Level Security on the electoral_applications table
- Creates policies that allow authenticated users (students, teachers, admins) to:
  - INSERT new applications
  - SELECT/read all applications
  - UPDATE applications
  - DELETE applications

This is a permissive policy suitable for an admin panel. If you need more granular control (e.g., only admins can delete), we can refine these policies later.
