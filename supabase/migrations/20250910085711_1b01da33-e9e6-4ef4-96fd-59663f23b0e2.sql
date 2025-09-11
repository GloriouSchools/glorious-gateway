-- Create function to generate student IDs with GPS prefix
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TEXT AS $$
DECLARE
    student_count INTEGER;
    new_number INTEGER;
    new_id TEXT;
BEGIN
    -- Get current student count for numbering
    SELECT COUNT(*) INTO student_count FROM students WHERE student_id IS NOT NULL;
    
    -- Start from next available number
    new_number := student_count + 1;
    
    -- Format as GPS + 4-digit padded number
    new_id := 'GPS' || LPAD(new_number::TEXT, 4, '0');
    
    -- Check if ID already exists, if so increment
    WHILE EXISTS (SELECT 1 FROM students WHERE student_id = new_id) LOOP
        new_number := new_number + 1;
        new_id := 'GPS' || LPAD(new_number::TEXT, 4, '0');
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate teacher codes
CREATE OR REPLACE FUNCTION generate_teacher_code()
RETURNS TEXT AS $$
DECLARE
    teacher_count INTEGER;
    new_number INTEGER;
    new_code TEXT;
BEGIN
    SELECT COUNT(*) INTO teacher_count FROM teachers WHERE teacher_code IS NOT NULL;
    new_number := teacher_count + 1;
    new_code := 'TCH' || LPAD(new_number::TEXT, 3, '0');
    
    WHILE EXISTS (SELECT 1 FROM teachers WHERE teacher_code = new_code) LOOP
        new_number := new_number + 1;
        new_code := 'TCH' || LPAD(new_number::TEXT, 3, '0');
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate class codes
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
    class_count INTEGER;
    new_number INTEGER;
    new_code TEXT;
BEGIN
    SELECT COUNT(*) INTO class_count FROM classes WHERE class_code IS NOT NULL;
    new_number := class_count + 1;
    new_code := 'CLS' || LPAD(new_number::TEXT, 2, '0');
    
    WHILE EXISTS (SELECT 1 FROM classes WHERE class_code = new_code) LOOP
        new_number := new_number + 1;
        new_code := 'CLS' || LPAD(new_number::TEXT, 2, '0');
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate stream codes  
CREATE OR REPLACE FUNCTION generate_stream_code()
RETURNS TEXT AS $$
DECLARE
    stream_count INTEGER;
    new_number INTEGER;
    new_code TEXT;
BEGIN
    SELECT COUNT(*) INTO stream_count FROM streams WHERE stream_code IS NOT NULL;
    new_number := stream_count + 1;
    new_code := 'STR' || LPAD(new_number::TEXT, 2, '0');
    
    WHILE EXISTS (SELECT 1 FROM streams WHERE stream_code = new_code) LOOP
        new_number := new_number + 1;
        new_code := 'STR' || LPAD(new_number::TEXT, 2, '0');
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Update existing records with readable IDs (only where NULL)
DO $$
DECLARE
    student_record RECORD;
    teacher_record RECORD;
    class_record RECORD;
    stream_record RECORD;
    counter INTEGER;
BEGIN
    -- Update students with GPS IDs
    counter := 1;
    FOR student_record IN SELECT id FROM students WHERE student_id IS NULL ORDER BY created_at LOOP
        UPDATE students 
        SET student_id = 'GPS' || LPAD(counter::TEXT, 4, '0') 
        WHERE id = student_record.id;
        counter := counter + 1;
    END LOOP;
    
    -- Update teachers with TCH codes
    counter := 1;
    FOR teacher_record IN SELECT id FROM teachers WHERE teacher_code IS NULL ORDER BY created_at LOOP
        UPDATE teachers 
        SET teacher_code = 'TCH' || LPAD(counter::TEXT, 3, '0') 
        WHERE id = teacher_record.id;
        counter := counter + 1;
    END LOOP;
    
    -- Update classes with CLS codes
    counter := 1;
    FOR class_record IN SELECT id FROM classes WHERE class_code IS NULL ORDER BY created_at LOOP
        UPDATE classes 
        SET class_code = 'CLS' || LPAD(counter::TEXT, 2, '0') 
        WHERE id = class_record.id;
        counter := counter + 1;
    END LOOP;
    
    -- Update streams with STR codes
    counter := 1;
    FOR stream_record IN SELECT id FROM streams WHERE stream_code IS NULL ORDER BY created_at LOOP
        UPDATE streams 
        SET stream_code = 'STR' || LPAD(counter::TEXT, 2, '0') 
        WHERE id = stream_record.id;
        counter := counter + 1;
    END LOOP;
END $$;