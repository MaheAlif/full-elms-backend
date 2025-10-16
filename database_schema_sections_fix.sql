-- =====================================================
-- SECTION MANAGEMENT: DATABASE SCHEMA FIX
-- =====================================================
-- This script fixes the database schema to properly support sections
-- Run this BEFORE the data migration script

USE elms;

-- 1. Add teacher_id to sections table (teachers assigned to specific sections)
ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS teacher_id BIGINT(20) NULL 
COMMENT 'Teacher assigned to this section' 
AFTER course_id;

-- Add foreign key constraint
ALTER TABLE sections 
ADD CONSTRAINT fk_sections_teacher 
FOREIGN KEY (teacher_id) REFERENCES users(id) 
ON DELETE SET NULL;

-- Add index for performance
ALTER TABLE sections 
ADD INDEX IF NOT EXISTS idx_teacher_id (teacher_id);

-- 2. Add capacity management to sections
ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS max_capacity INT DEFAULT 50 
COMMENT 'Maximum students allowed in this section'
AFTER name;

ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS current_enrollment INT DEFAULT 0 
COMMENT 'Current number of enrolled students'
AFTER max_capacity;

-- 3. Update sections table metadata
ALTER TABLE sections 
ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
AFTER current_enrollment;

-- 4. Fix enrollments table - ensure section_id is NOT NULL where possible
-- (We'll fix NULL values in the data migration script)
ALTER TABLE enrollments 
MODIFY COLUMN section_id BIGINT(20) NULL COMMENT 'Section student is enrolled in';

-- 5. Add index for enrollment queries
ALTER TABLE enrollments 
ADD INDEX IF NOT EXISTS idx_section_user (section_id, user_id);

-- 6. Verify the changes
SELECT 'Schema migration completed successfully!' AS status;

-- Show updated sections table structure
DESCRIBE sections;

-- Show updated enrollments table structure  
DESCRIBE enrollments;
