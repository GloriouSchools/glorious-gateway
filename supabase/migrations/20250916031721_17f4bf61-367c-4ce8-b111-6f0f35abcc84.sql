-- Update student emails to use only first two names (ignoring additional names)
-- Create a function to generate the new email format
CREATE OR REPLACE FUNCTION generate_simple_email(full_name TEXT) RETURNS TEXT AS $$
DECLARE
    name_parts TEXT[];
    base_email TEXT := '';
BEGIN
    -- Split name into parts and clean
    name_parts := string_to_array(lower(trim(full_name)), ' ');
    
    -- Remove empty parts
    name_parts := array_remove(name_parts, '');
    
    IF array_length(name_parts, 1) IS NULL OR array_length(name_parts, 1) = 0 THEN
        RETURN NULL;
    END IF;
    
    IF array_length(name_parts, 1) = 1 THEN
        -- Single name
        base_email := name_parts[1];
    ELSE
        -- Use only first two names, ignore all additional names
        base_email := name_parts[1] || name_parts[2];
    END IF;
    
    -- Remove special characters, keep only alphanumeric
    base_email := regexp_replace(base_email, '[^a-z0-9]', '', 'g');
    
    RETURN base_email || '@glorious.com';
END;
$$ LANGUAGE plpgsql;

-- Update all student emails
UPDATE public.students 
SET email = generate_simple_email(name)
WHERE name IS NOT NULL AND name != '';

-- Handle duplicates by adding numbers
WITH email_counts AS (
    SELECT email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as rn
    FROM public.students
    WHERE email IS NOT NULL
),
duplicates AS (
    SELECT students.id, 
           CASE 
               WHEN email_counts.rn = 1 THEN students.email
               ELSE regexp_replace(students.email, '@glorious\.com$', '') || (email_counts.rn - 1)::text || '@glorious.com'
           END as new_email
    FROM public.students
    JOIN email_counts ON students.email = email_counts.email
    WHERE email_counts.rn > 1
)
UPDATE public.students 
SET email = duplicates.new_email
FROM duplicates
WHERE students.id = duplicates.id;

-- Drop the temporary function
DROP FUNCTION generate_simple_email(TEXT);