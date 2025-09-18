-- Update email addresses to use first two names only and handle duplicates

-- Create a function to generate proper email from name
CREATE OR REPLACE FUNCTION generate_email_from_name(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
    name_parts TEXT[];
    base_email TEXT;
BEGIN
    -- Split name and clean it
    name_parts := string_to_array(LOWER(TRIM(full_name)), ' ');
    
    -- Remove empty parts
    name_parts := array_remove(name_parts, '');
    
    IF array_length(name_parts, 1) IS NULL OR array_length(name_parts, 1) = 0 THEN
        RETURN NULL;
    END IF;
    
    -- Use first two names only
    IF array_length(name_parts, 1) = 1 THEN
        base_email := name_parts[1];
    ELSE
        base_email := name_parts[1] || name_parts[2];
    END IF;
    
    -- Remove special characters
    base_email := regexp_replace(base_email, '[^a-z0-9]', '', 'g');
    
    RETURN base_email || '@glorious.com';
END;
$$ LANGUAGE plpgsql;

-- Update students emails
UPDATE public.students 
SET email = CASE 
    WHEN EXISTS (
        SELECT 1 FROM public.students s2 
        WHERE s2.id != students.id 
        AND generate_email_from_name(s2.name) = generate_email_from_name(students.name)
        AND s2.id < students.id
    ) THEN
        -- Add incremental number for duplicates
        regexp_replace(generate_email_from_name(students.name), '@glorious\.com$', '') ||
        (
            SELECT COUNT(*) FROM public.students s3 
            WHERE s3.id < students.id 
            AND generate_email_from_name(s3.name) = generate_email_from_name(students.name)
        )::TEXT || '@glorious.com'
    ELSE
        generate_email_from_name(students.name)
END
WHERE students.name IS NOT NULL;

-- Update teachers emails
UPDATE public.teachers 
SET email = CASE 
    WHEN EXISTS (
        SELECT 1 FROM public.teachers t2 
        WHERE t2.id != teachers.id 
        AND generate_email_from_name(t2.name) = generate_email_from_name(teachers.name)
        AND t2.id < teachers.id
    ) THEN
        -- Add incremental number for duplicates
        regexp_replace(generate_email_from_name(teachers.name), '@glorious\.com$', '') ||
        (
            SELECT COUNT(*) FROM public.teachers t3 
            WHERE t3.id < teachers.id 
            AND generate_email_from_name(t3.name) = generate_email_from_name(teachers.name)
        )::TEXT || '@glorious.com'
    ELSE
        generate_email_from_name(teachers.name)
END
WHERE teachers.name IS NOT NULL;

-- Update admins emails
UPDATE public.admins 
SET email = CASE 
    WHEN EXISTS (
        SELECT 1 FROM public.admins a2 
        WHERE a2.id != admins.id 
        AND generate_email_from_name(a2.name) = generate_email_from_name(admins.name)
        AND a2.id < admins.id
    ) THEN
        -- Add incremental number for duplicates
        regexp_replace(generate_email_from_name(admins.name), '@glorious\.com$', '') ||
        (
            SELECT COUNT(*) FROM public.admins a3 
            WHERE a3.id < admins.id 
            AND generate_email_from_name(a3.name) = generate_email_from_name(admins.name)
        )::TEXT || '@glorious.com'
    ELSE
        generate_email_from_name(admins.name)
END
WHERE admins.name IS NOT NULL;

-- Update electoral applications with new student emails
UPDATE public.electoral_applications 
SET student_email = s.email
FROM public.students s
WHERE s.id = electoral_applications.student_id;

-- Update electoral votes with new voter emails  
UPDATE public.electoral_votes
SET voter_email = COALESCE(s.email, t.email, a.email)
FROM public.students s
FULL OUTER JOIN public.teachers t ON t.id = electoral_votes.voter_id
FULL OUTER JOIN public.admins a ON a.id = electoral_votes.voter_id
WHERE s.id = electoral_votes.voter_id 
   OR t.id = electoral_votes.voter_id 
   OR a.id = electoral_votes.voter_id;

-- Drop the helper function
DROP FUNCTION generate_email_from_name(TEXT);