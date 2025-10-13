-- Add missing columns to submissions table for grading functionality

USE elms;

-- Add feedback column
ALTER TABLE submissions ADD COLUMN feedback TEXT;

-- Add graded_at timestamp column  
ALTER TABLE submissions ADD COLUMN graded_at DATETIME;

-- Add graded_by column to track which teacher graded the submission
ALTER TABLE submissions ADD COLUMN graded_by BIGINT;

-- Add foreign key constraint for graded_by
ALTER TABLE submissions ADD FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL;

-- Update the enrollments table structure to be compatible with our queries
-- The current structure uses section_id, but our queries expect course_id
-- Let's add course_id to enrollments for better performance

-- First, add the course_id column
ALTER TABLE enrollments ADD COLUMN course_id BIGINT;

-- Update the course_id values based on existing section_id
UPDATE enrollments e 
JOIN sections s ON e.section_id = s.id 
SET e.course_id = s.course_id;

-- Make course_id NOT NULL and add foreign key
ALTER TABLE enrollments MODIFY COLUMN course_id BIGINT NOT NULL;
ALTER TABLE enrollments ADD FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Add missing columns to courses table
ALTER TABLE courses ADD COLUMN course_code VARCHAR(20);
ALTER TABLE courses ADD COLUMN credits INT DEFAULT 3;
ALTER TABLE courses ADD COLUMN semester VARCHAR(20);
ALTER TABLE courses ADD COLUMN academic_year VARCHAR(10);

-- Update existing courses with sample data
UPDATE courses SET 
    course_code = CONCAT('CS', LPAD(id, 3, '0')),
    credits = 3,
    semester = 'Fall',
    academic_year = '2024'
WHERE course_code IS NULL;