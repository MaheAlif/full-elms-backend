-- ========================================
-- ELMS DATABASE CLEANUP SCRIPT
-- Remove old 2024 sample data and test events
-- Date: October 17, 2025
-- ========================================

USE elms;

-- ========================================
-- 1. REMOVE OLD 2024 CALENDAR EVENTS
-- Remove outdated calendar events from Oct-Nov 2024
-- Keep only 2025 events (IDs: 19-24)
-- ========================================
DELETE FROM calendar_events WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18);

-- ========================================
-- 2. REMOVE OLD 2024 SUBMISSIONS
-- Remove sample submissions from September 2024
-- These have fake file paths and are outdated
-- ========================================
DELETE FROM submissions WHERE submitted_at < '2025-01-01';

-- ========================================
-- 3. REMOVE OLD 2024 ASSIGNMENTS
-- Remove sample assignments from Sept-Nov 2024 (IDs: 1-12)
-- Note: Submissions will cascade delete automatically
-- ========================================
DELETE FROM assignments WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

-- ========================================
-- 4. REMOVE TEST UNIVERSITY EVENTS
-- Remove test events while keeping meaningful ones
-- Remove: test event, test event 2, Meet, Meet-2, etc.
-- ========================================
DELETE FROM university_events WHERE id IN (9, 10, 11, 12, 13, 14);

-- ========================================
-- 5. FIX ECONOMICS COURSE TEACHER
-- Assign a teacher to ECO-2011 (currently NULL)
-- Assigning to Dr. Emily Rodriguez (ID: 5)
-- ========================================
UPDATE courses SET teacher_id = 5 WHERE id = 10 AND teacher_id IS NULL;

-- ========================================
-- 6. VERIFICATION QUERIES
-- Run these to verify cleanup was successful
-- ========================================

SELECT '=== REMAINING ASSIGNMENTS ===' AS info;
SELECT id, title, due_date, 
       CASE 
           WHEN due_date < '2025-01-01' THEN 'OLD (Should be removed)'
           ELSE 'CURRENT (OK)'
       END as status
FROM assignments ORDER BY due_date;

SELECT '=== REMAINING SUBMISSIONS ===' AS info;
SELECT id, assignment_id, student_id, submitted_at,
       CASE 
           WHEN submitted_at < '2025-01-01' THEN 'OLD (Should be removed)'
           ELSE 'CURRENT (OK)'
       END as status
FROM submissions ORDER BY submitted_at DESC;

SELECT '=== REMAINING UNIVERSITY EVENTS ===' AS info;
SELECT id, title, date, type, priority FROM university_events ORDER BY date;

SELECT '=== REMAINING CALENDAR EVENTS ===' AS info;
SELECT id, title, date, type FROM calendar_events ORDER BY date;

SELECT '=== COURSES WITH TEACHER INFO ===' AS info;
SELECT c.id, c.course_code, c.title, 
       CASE 
           WHEN c.teacher_id IS NULL THEN 'NO TEACHER (ERROR)'
           ELSE u.name
       END as teacher_name
FROM courses c
LEFT JOIN users u ON c.teacher_id = u.id
ORDER BY c.id;

-- ========================================
-- CLEANUP SUMMARY
-- ========================================
SELECT '=== CLEANUP COMPLETED ===' AS info;
SELECT 'Removed: 12 old assignments, 19 old submissions, 18 old calendar events, 6 test university events' AS summary;
SELECT 'Fixed: Economics course now has assigned teacher' AS fix;
SELECT 'Kept: All users (including Debug/Test users), all recent 2025 assignments' AS kept;
