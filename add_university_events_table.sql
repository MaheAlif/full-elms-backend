-- Add university events table for admin-managed calendar events
USE elms;

-- Create university_events table for university-wide calendar events
CREATE TABLE IF NOT EXISTS university_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    type ENUM('holiday', 'exam_week', 'registration', 'orientation', 'graduation', 'maintenance', 'event') NOT NULL,
    priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert some sample university events
INSERT INTO university_events (title, description, date, type, priority, created_by) VALUES
('Fall Semester Registration', 'Online registration opens for Fall 2025 semester. Students must complete course selection by the deadline.', '2025-08-15', 'registration', 'high', 1),
('Mid-term Exam Week', 'Mid-term examinations for all courses. No regular classes scheduled during this period.', '2025-10-14', 'exam_week', 'high', 1),
('Independence Day Holiday', 'University closed in observance of Independence Day. All classes and offices closed.', '2025-03-26', 'holiday', 'normal', 1),
('New Student Orientation', 'Mandatory orientation session for all newly admitted students. Campus tour and academic guidelines.', '2025-09-01', 'orientation', 'high', 1),
('System Maintenance', 'Scheduled maintenance of university IT systems. Online services may be temporarily unavailable.', '2025-11-15', 'maintenance', 'normal', 1),
('Annual Sports Day', 'University-wide sports competition and cultural activities. All students and faculty invited.', '2025-12-10', 'event', 'normal', 1),
('Final Exam Period', 'Final examinations for Fall 2025 semester. Students must check exam schedules on the portal.', '2025-12-15', 'exam_week', 'high', 1),
('Winter Break Begins', 'Winter vacation starts. University closed until next semester.', '2025-12-25', 'holiday', 'normal', 1);

-- Update calendar_events table to include description if not exists
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS description TEXT AFTER title;

-- Add index for better query performance on dates
CREATE INDEX IF NOT EXISTS idx_university_events_date ON university_events(date);
CREATE INDEX IF NOT EXISTS idx_university_events_type ON university_events(type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);