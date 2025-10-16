-- Add Mahe Alif enrollments to see materials
-- First, find Mahe Alif's user ID
SELECT id, name, email FROM users WHERE email = 'mahe221130@bscse.uiu.ac.bd';

-- Add enrollments for Mahe Alif (assuming user ID is what we find above)
-- We'll enroll them in sections that have materials

-- Check available sections with materials
SELECT DISTINCT s.id, s.name, c.title, c.course_code, COUNT(m.id) as material_count
FROM sections s 
JOIN courses c ON s.course_id = c.id 
LEFT JOIN materials m ON s.id = m.section_id 
GROUP BY s.id, s.name, c.title, c.course_code
HAVING material_count > 0;

-- Insert enrollments (replace USER_ID with actual ID from first query)
-- INSERT INTO enrollments (user_id, section_id) VALUES
-- (USER_ID, 1),  -- React Development - Section A (has materials)
-- (USER_ID, 3);  -- Machine Learning - Section A (has materials)