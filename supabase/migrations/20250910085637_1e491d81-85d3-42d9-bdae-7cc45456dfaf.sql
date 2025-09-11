-- Add readable ID columns to existing tables
ALTER TABLE students ADD COLUMN student_id TEXT UNIQUE;
ALTER TABLE teachers ADD COLUMN teacher_code TEXT UNIQUE;
ALTER TABLE classes ADD COLUMN class_code TEXT UNIQUE;
ALTER TABLE streams ADD COLUMN stream_code TEXT UNIQUE;

-- Create function to generate student IDs
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TEXT AS $$
DECLARE
    student_count INTEGER;
    new_number INTEGER;
    new_id TEXT;
BEGIN
    -- Get current student count
    SELECT COUNT(*) INTO student_count FROM students;
    
    -- Generate next number (1-based)
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
    SELECT COUNT(*) INTO teacher_count FROM teachers;
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
    SELECT COUNT(*) INTO class_count FROM classes;
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
    SELECT COUNT(*) INTO stream_count FROM streams;
    new_number := stream_count + 1;
    new_code := 'STR' || LPAD(new_number::TEXT, 2, '0');
    
    WHILE EXISTS (SELECT 1 FROM streams WHERE stream_code = new_code) LOOP
        new_number := new_number + 1;
        new_code := 'STR' || LPAD(new_number::TEXT, 2, '0');
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Update existing records with readable IDs
UPDATE students SET student_id = generate_student_id() WHERE student_id IS NULL;
UPDATE teachers SET teacher_code = generate_teacher_code() WHERE teacher_code IS NULL;
UPDATE classes SET class_code = generate_class_code() WHERE class_code IS NULL;
UPDATE streams SET stream_code = generate_stream_code() WHERE stream_code IS NULL;

-- Create triggers to automatically assign readable IDs for new records
CREATE OR REPLACE FUNCTION assign_student_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL THEN
        NEW.student_id := generate_student_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_teacher_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.teacher_code IS NULL THEN
        NEW.teacher_code := generate_teacher_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_class_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.class_code IS NULL THEN
        NEW.class_code := generate_class_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_stream_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stream_code IS NULL THEN
        NEW.stream_code := generate_stream_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_assign_student_id
    BEFORE INSERT ON students
    FOR EACH ROW
    EXECUTE FUNCTION assign_student_id();

CREATE TRIGGER trigger_assign_teacher_code
    BEFORE INSERT ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION assign_teacher_code();

CREATE TRIGGER trigger_assign_class_code
    BEFORE INSERT ON classes
    FOR EACH ROW
    EXECUTE FUNCTION assign_class_code();

CREATE TRIGGER trigger_assign_stream_code
    BEFORE INSERT ON streams
    FOR EACH ROW
    EXECUTE FUNCTION assign_stream_code();