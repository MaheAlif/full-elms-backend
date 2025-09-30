-- ================================================================
-- ELMS Database - Comprehensive Fake Data Insert
-- ================================================================
-- This script populates the ELMS database with realistic fake data
-- Following UIU (United International University) naming conventions
-- ================================================================

USE elms;

-- Clear existing data (optional - uncomment if you want fresh data)
-- DELETE FROM ai_interactions;
-- DELETE FROM ai_user_context;
-- DELETE FROM notifications;
-- DELETE FROM chat_messages;
-- DELETE FROM chat_rooms;
-- DELETE FROM calendar_events;
-- DELETE FROM submissions;
-- DELETE FROM assignments;
-- DELETE FROM materials;
-- DELETE FROM announcements;
-- DELETE FROM enrollments;
-- DELETE FROM sections;
-- DELETE FROM courses;
-- DELETE FROM users;

-- ================================================================
-- INSERT USERS (Students, Teachers, Admins)
-- ================================================================

-- Admin Users
INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES
('Dr. Aminul Islam', 'admin.aminul@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'https://i.pravatar.cc/150?img=1'),
('Prof. Rashida Khatun', 'admin.rashida@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'https://i.pravatar.cc/150?img=2');

-- Teachers
INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=3'),
('Prof. Michael Chen', 'michael.chen@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=4'),
('Dr. Emily Rodriguez', 'emily.rodriguez@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=5'),
('Prof. David Kim', 'david.kim@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=6'),
('Dr. Fatima Rahman', 'fatima.rahman@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=7'),
('Prof. Ahmed Hassan', 'ahmed.hassan@uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'https://i.pravatar.cc/150?img=8');

-- Students (UIU naming convention: name + ID + @bscse.uiu.ac.bd)
INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES
('Sakib Islam', 'sakib221131@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=9'),
('Fatima Akter', 'fatima221132@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=10'),
('Ariful Haque', 'ariful221133@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=11'),
('Nusrat Jahan', 'nusrat221134@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=12'),
('Rafiqul Islam', 'rafiqul221135@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=13'),
('Taslima Khatun', 'taslima221136@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=14'),
('Mohammad Ali', 'mohammad221137@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=15'),
('Rashida Begum', 'rashida221138@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=16'),
('Aminul Islam', 'aminul221139@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=17'),
('Salma Akter', 'salma221140@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=18'),
('Karim Rahman', 'karim221141@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=19'),
('Nasreen Sultana', 'nasreen221142@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=20'),
('Jahangir Alam', 'jahangir221143@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=21'),
('Rubina Yasmin', 'rubina221144@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=22'),
('Shahin Ahmed', 'shahin221145@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=23'),
('Rokeya Khatun', 'rokeya221146@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=24'),
('Habibur Rahman', 'habibur221147@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=25'),
('Sultana Rajia', 'sultana221148@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=26'),
('Abdullah Al Mamun', 'abdullah221149@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=27'),
('Marium Akter', 'marium221150@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'https://i.pravatar.cc/150?img=28');

-- ================================================================
-- INSERT COURSES
-- ================================================================

INSERT INTO courses (title, description, teacher_id, color) VALUES
('Advanced React Development', 'Deep dive into React hooks, context, performance optimization, and modern patterns', 3, 'bg-gradient-to-r from-cyan-500 to-blue-500'),
('Machine Learning Fundamentals', 'Introduction to ML algorithms, data science, and practical applications', 4, 'bg-gradient-to-r from-purple-500 to-pink-500'),
('Database Design & SQL', 'Relational database concepts, advanced SQL queries, and optimization techniques', 5, 'bg-gradient-to-r from-green-500 to-teal-500'),
('Web Security & Cryptography', 'Modern web security practices, cryptographic protocols, and ethical hacking', 6, 'bg-gradient-to-r from-orange-500 to-red-500'),
('Data Structures & Algorithms', 'Advanced data structures, algorithm design, and complexity analysis', 7, 'bg-gradient-to-r from-indigo-500 to-purple-500'),
('Software Engineering Principles', 'Software development lifecycle, design patterns, and project management', 8, 'bg-gradient-to-r from-yellow-500 to-orange-500');

-- ================================================================
-- INSERT SECTIONS
-- ================================================================

INSERT INTO sections (course_id, name) VALUES
(1, 'CSE 4101 - Section A'),
(1, 'CSE 4101 - Section B'),
(2, 'CSE 4201 - Section A'),
(2, 'CSE 4201 - Section B'),
(3, 'CSE 3301 - Section A'),
(4, 'CSE 4401 - Section A'),
(5, 'CSE 2501 - Section A'),
(5, 'CSE 2501 - Section B'),
(6, 'CSE 3601 - Section A');

-- ================================================================
-- INSERT ENROLLMENTS
-- ================================================================

-- Distribute students across sections
INSERT INTO enrollments (user_id, section_id) VALUES
-- React Development - Section A
(9, 1), (10, 1), (11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1),
-- React Development - Section B
(19, 2), (20, 2), (21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (26, 2), (27, 2), (28, 2),
-- Machine Learning - Section A
(9, 3), (11, 3), (13, 3), (15, 3), (17, 3), (19, 3), (21, 3), (23, 3), (25, 3), (27, 3),
-- Machine Learning - Section B
(10, 4), (12, 4), (14, 4), (16, 4), (18, 4), (20, 4), (22, 4), (24, 4), (26, 4), (28, 4),
-- Database Design - Section A
(9, 5), (10, 5), (11, 5), (12, 5), (19, 5), (20, 5), (21, 5), (22, 5),
-- Web Security - Section A
(13, 6), (14, 6), (15, 6), (16, 6), (23, 6), (24, 6), (25, 6), (26, 6),
-- Data Structures - Section A
(17, 7), (18, 7), (27, 7), (28, 7), (9, 7), (10, 7),
-- Data Structures - Section B
(19, 8), (20, 8), (21, 8), (22, 8), (11, 8), (12, 8),
-- Software Engineering - Section A
(23, 9), (24, 9), (25, 9), (26, 9), (13, 9), (14, 9), (15, 9), (16, 9);

-- ================================================================
-- INSERT ANNOUNCEMENTS
-- ================================================================

INSERT INTO announcements (section_id, title, content) VALUES
(1, 'Welcome to Advanced React Development!', 'Welcome everyone! We will start with React hooks and gradually move to advanced patterns. Please join the class discussion group.'),
(1, 'Assignment 1 Released', 'The first assignment on React Hooks is now available. Due date: Next Friday. Please check the materials section for details.'),
(2, 'Lab Session Schedule', 'Lab sessions will be held every Tuesday and Thursday from 2:00 PM to 4:00 PM in Computer Lab 3.'),
(3, 'Machine Learning Project Guidelines', 'For the semester project, you need to work in teams of 3-4 students. Project topics will be discussed in next class.'),
(4, 'Dataset Links Updated', 'All dataset links for ML exercises have been updated in the materials section. Please download them before the next lab.'),
(5, 'Database Schema Assignment', 'Design a database schema for an e-commerce system. Submission deadline: End of this week.'),
(6, 'Security Workshop Next Week', 'We will have a special workshop on penetration testing next Monday. Attendance is mandatory.'),
(7, 'Midterm Exam Schedule', 'Midterm exam will be held on 15th October 2024. Covers topics from Week 1-7.'),
(8, 'Algorithm Competition', 'UIU Algorithm Competition registration is open. Participate to enhance your problem-solving skills!'),
(9, 'Software Project Proposal', 'Submit your software project proposal by next Wednesday. Include technology stack and timeline.');

-- ================================================================
-- INSERT MATERIALS (File paths - actual files not included as requested)
-- ================================================================

INSERT INTO materials (section_id, title, type, file_path, size) VALUES
-- React Development Materials
(1, 'React Hooks Deep Dive', 'pdf', '/uploads/courses/react/hooks-deep-dive.pdf', '2.5 MB'),
(1, 'Component Optimization Techniques', 'ppt', '/uploads/courses/react/optimization-techniques.pptx', '8.1 MB'),
(1, 'State Management Best Practices', 'doc', '/uploads/courses/react/state-management.docx', '1.2 MB'),
(2, 'React Performance Monitoring', 'pdf', '/uploads/courses/react/performance-monitoring.pdf', '3.2 MB'),
(2, 'Advanced React Patterns', 'ppt', '/uploads/courses/react/advanced-patterns.pptx', '12.5 MB'),

-- Machine Learning Materials
(3, 'Linear Regression Introduction', 'pdf', '/uploads/courses/ml/linear-regression.pdf', '3.8 MB'),
(3, 'Supervised Learning Algorithms', 'pdf', '/uploads/courses/ml/supervised-learning.pdf', '5.2 MB'),
(4, 'Neural Networks Fundamentals', 'ppt', '/uploads/courses/ml/neural-networks.pptx', '15.3 MB'),
(4, 'Data Preprocessing Techniques', 'doc', '/uploads/courses/ml/data-preprocessing.docx', '2.1 MB'),

-- Database Materials
(5, 'SQL Query Optimization', 'pdf', '/uploads/courses/db/sql-optimization.pdf', '4.5 MB'),
(5, 'Database Normalization Guide', 'pdf', '/uploads/courses/db/normalization.pdf', '2.8 MB'),
(5, 'Advanced SQL Techniques', 'doc', '/uploads/courses/db/advanced-sql.docx', '3.1 MB'),

-- Security Materials
(6, 'Web Application Security', 'pdf', '/uploads/courses/security/web-app-security.pdf', '6.2 MB'),
(6, 'Cryptography Fundamentals', 'ppt', '/uploads/courses/security/cryptography.pptx', '9.8 MB'),

-- Data Structures Materials
(7, 'Graph Algorithms Implementation', 'pdf', '/uploads/courses/ds/graph-algorithms.pdf', '4.1 MB'),
(8, 'Dynamic Programming Techniques', 'pdf', '/uploads/courses/ds/dynamic-programming.pdf', '3.7 MB'),

-- Software Engineering Materials
(9, 'Agile Development Methodology', 'pdf', '/uploads/courses/se/agile-methodology.pdf', '5.5 MB'),
(9, 'Design Patterns in Practice', 'ppt', '/uploads/courses/se/design-patterns.pptx', '11.2 MB');

-- ================================================================
-- INSERT ASSIGNMENTS
-- ================================================================

INSERT INTO assignments (section_id, title, description, due_date, total_marks) VALUES
(1, 'React Hooks Implementation', 'Create a todo application using React hooks (useState, useEffect, useContext). Include add, edit, delete, and filter functionality.', '2024-10-20 23:59:00', 100),
(1, 'Performance Optimization Project', 'Optimize a given React application for better performance. Document your optimization techniques and measure improvements.', '2024-11-05 23:59:00', 150),
(2, 'Component Library Creation', 'Build a reusable component library with at least 10 components. Include proper documentation and TypeScript support.', '2024-10-25 23:59:00', 120),

(3, 'Linear Regression Analysis', 'Implement linear regression from scratch and apply it to a real-world dataset. Compare with sklearn implementation.', '2024-10-18 23:59:00', 100),
(3, 'Classification Model Comparison', 'Compare performance of different classification algorithms on the Iris dataset. Provide detailed analysis report.', '2024-11-02 23:59:00', 130),
(4, 'Neural Network Implementation', 'Build a simple neural network without using deep learning frameworks. Train it on MNIST digit recognition.', '2024-10-22 23:59:00', 140),

(5, 'Database Schema Design', 'Design and implement a complete database schema for an e-commerce system. Include proper relationships and constraints.', '2024-10-15 23:59:00', 100),
(5, 'Query Optimization Challenge', 'Optimize given slow SQL queries and demonstrate performance improvements with execution plans.', '2024-11-01 23:59:00', 110),

(6, 'Security Vulnerability Assessment', 'Perform security assessment on a given web application. Identify vulnerabilities and suggest remediation.', '2024-10-28 23:59:00', 120),

(7, 'Algorithm Implementation Portfolio', 'Implement 10 different algorithms with time/space complexity analysis. Include graph, sorting, and searching algorithms.', '2024-10-30 23:59:00', 150),
(8, 'Data Structure Performance Analysis', 'Compare performance of different data structures for specific use cases. Provide benchmarking results.', '2024-11-03 23:59:00', 130),

(9, 'Software Development Project', 'Develop a complete web application following agile methodology. Include documentation, testing, and deployment.', '2024-11-15 23:59:00', 200);

-- ================================================================
-- INSERT SUBMISSIONS (Some completed, some pending)
-- ================================================================

INSERT INTO submissions (assignment_id, student_id, file_path, grade) VALUES
-- React Hooks Assignment submissions (completed)
(1, 9, '/uploads/submissions/sakib_react_hooks.zip', 85),
(1, 10, '/uploads/submissions/fatima_react_hooks.zip', 92),
(1, 11, '/uploads/submissions/ariful_react_hooks.zip', 78),
(1, 12, '/uploads/submissions/nusrat_react_hooks.zip', 88),
(1, 13, '/uploads/submissions/rafiqul_react_hooks.zip', 76),
(1, 14, '/uploads/submissions/taslima_react_hooks.zip', 90),

-- ML Linear Regression submissions (completed)
(4, 9, '/uploads/submissions/sakib_ml_regression.zip', 82),
(4, 11, '/uploads/submissions/ariful_ml_regression.zip', 89),
(4, 13, '/uploads/submissions/rafiqul_ml_regression.zip', 94),
(4, 15, '/uploads/submissions/mohammad_ml_regression.zip', 87),

-- Database Schema submissions (completed)
(7, 9, '/uploads/submissions/sakib_db_schema.sql', 91),
(7, 10, '/uploads/submissions/fatima_db_schema.sql', 83),
(7, 11, '/uploads/submissions/ariful_db_schema.sql', 95),
(7, 12, '/uploads/submissions/nusrat_db_schema.sql', 88),

-- Some pending submissions (no grade yet)
(2, 19, '/uploads/submissions/karim_react_performance.zip', NULL),
(2, 20, '/uploads/submissions/nasreen_react_performance.zip', NULL),
(5, 10, '/uploads/submissions/fatima_ml_classification.zip', NULL),
(5, 12, '/uploads/submissions/nusrat_ml_classification.zip', NULL);

-- ================================================================
-- INSERT CALENDAR EVENTS
-- ================================================================

INSERT INTO calendar_events (section_id, title, date, type) VALUES
-- React Development Events
(1, 'React Assignment Due', '2024-10-20', 'assignment'),
(1, 'Midterm Exam', '2024-10-15', 'exam'),
(1, 'Lab Session: Hooks Practice', '2024-10-12', 'class'),
(2, 'Component Library Project Due', '2024-10-25', 'assignment'),
(2, 'Guest Lecture: React Best Practices', '2024-10-18', 'meeting'),

-- Machine Learning Events
(3, 'ML Assignment Submission', '2024-10-18', 'assignment'),
(3, 'Data Science Workshop', '2024-10-14', 'meeting'),
(4, 'Neural Networks Lab', '2024-10-16', 'class'),
(4, 'ML Midterm Exam', '2024-10-22', 'exam'),

-- Database Events
(5, 'Database Schema Due', '2024-10-15', 'assignment'),
(5, 'SQL Performance Lab', '2024-10-13', 'class'),

-- Security Events
(6, 'Penetration Testing Workshop', '2024-10-21', 'meeting'),
(6, 'Security Assessment Due', '2024-10-28', 'assignment'),

-- Data Structures Events
(7, 'Algorithm Portfolio Due', '2024-10-30', 'assignment'),
(8, 'Coding Competition', '2024-10-19', 'meeting'),

-- Software Engineering Events
(9, 'Project Proposal Due', '2024-10-17', 'assignment'),
(9, 'Agile Development Workshop', '2024-10-24', 'meeting'),
(9, 'Final Project Demo', '2024-11-15', 'exam');

-- ================================================================
-- INSERT CHAT ROOMS
-- ================================================================

INSERT INTO chat_rooms (section_id, name) VALUES
(1, 'React Dev - Section A Discussion'),
(2, 'React Dev - Section B Discussion'),
(3, 'ML Fundamentals - Section A'),
(4, 'ML Fundamentals - Section B'),
(5, 'Database Design Discussion'),
(6, 'Web Security Forum'),
(7, 'Data Structures - Section A'),
(8, 'Data Structures - Section B'),
(9, 'Software Engineering Chat');

-- ================================================================
-- INSERT CHAT MESSAGES
-- ================================================================

INSERT INTO chat_messages (room_id, sender_id, message, timestamp) VALUES
-- React Dev Section A Chat
(1, 9, 'Has anyone started working on the React hooks assignment yet?', '2024-10-10 10:30:00'),
(1, 10, 'Yes, I\'m working on the useState part. The useEffect is a bit tricky though.', '2024-10-10 10:32:00'),
(1, 3, 'Remember that useEffect runs after every render by default. Make sure to include the dependency array!', '2024-10-10 10:35:00'),
(1, 11, 'Thanks Dr. Johnson! That clears up the confusion.', '2024-10-10 10:37:00'),
(1, 12, 'Don\'t forget the submission deadline is tomorrow at 11:59 PM!', '2024-10-10 11:00:00'),
(1, 13, 'Can we use external libraries like Material-UI for styling?', '2024-10-10 11:15:00'),
(1, 3, 'Yes, you can use any UI library, but focus on implementing the hooks correctly.', '2024-10-10 11:18:00'),

-- ML Section A Chat
(3, 15, 'The linear regression dataset is quite large. Any tips for preprocessing?', '2024-10-09 14:20:00'),
(3, 17, 'I used pandas for data cleaning. Check for null values and outliers first.', '2024-10-09 14:25:00'),
(3, 4, 'Good advice! Also normalize your features for better convergence.', '2024-10-09 14:30:00'),
(3, 19, 'Should we implement gradient descent from scratch or use built-in functions?', '2024-10-09 14:45:00'),
(3, 4, 'Implement from scratch first to understand the math, then compare with sklearn.', '2024-10-09 14:50:00'),

-- Database Section Chat
(5, 9, 'Anyone having trouble with the foreign key constraints in the e-commerce schema?', '2024-10-08 16:10:00'),
(5, 21, 'Make sure your referenced columns have the same data type and are indexed.', '2024-10-08 16:15:00'),
(5, 5, 'Great discussion! Remember to consider cascading deletes and updates carefully.', '2024-10-08 16:20:00'),
(5, 22, 'Dr. Rodriguez, should we include audit tables for tracking changes?', '2024-10-08 16:25:00'),
(5, 5, 'That\'s an excellent idea for a production system! Bonus points if you implement it.', '2024-10-08 16:30:00'),

-- Security Section Chat
(6, 23, 'The OWASP Top 10 list is really eye-opening. SQL injection is everywhere!', '2024-10-07 13:40:00'),
(6, 25, 'I found three SQL injection vulnerabilities in the test application already.', '2024-10-07 13:45:00'),
(6, 6, 'Excellent work! Make sure to document the impact and remediation steps.', '2024-10-07 13:50:00'),
(6, 24, 'Prof. Kim, will we cover XSS prevention techniques in the next class?', '2024-10-07 14:00:00'),
(6, 6, 'Yes, we\'ll cover XSS, CSRF, and secure coding practices next week.', '2024-10-07 14:05:00');

-- ================================================================
-- INSERT NOTIFICATIONS
-- ================================================================

INSERT INTO notifications (user_id, type, message, read_status) VALUES
-- Assignment notifications for students
(9, 'assignment', 'New assignment "React Hooks Implementation" has been posted in Advanced React Development', FALSE),
(9, 'due_event', 'Assignment "Database Schema Design" is due in 2 days', FALSE),
(9, 'grade_posted', 'Your submission for "React Hooks Implementation" has been graded: 85/100', TRUE),

(10, 'assignment', 'New assignment "Component Library Creation" has been posted', FALSE),
(10, 'grade_posted', 'Your submission for "React Hooks Implementation" has been graded: 92/100', TRUE),
(10, 'reminder', 'Don\'t forget to attend tomorrow\'s ML workshop at 2 PM', FALSE),

(11, 'assignment', 'New assignment "Linear Regression Analysis" is now available', FALSE),
(11, 'grade_posted', 'Your submission for "Database Schema Design" has been graded: 95/100', TRUE),
(11, 'due_event', 'Assignment "Algorithm Implementation Portfolio" is due in 5 days', FALSE),

(12, 'grade_posted', 'Your submission for "React Hooks Implementation" has been graded: 88/100', TRUE),
(12, 'assignment', 'New assignment "Query Optimization Challenge" has been posted', FALSE),

-- Teacher notifications
(3, 'reminder', 'You have 15 pending submissions to grade in Advanced React Development', FALSE),
(4, 'reminder', 'Midterm exam for Machine Learning Fundamentals is scheduled for next week', FALSE),
(5, 'reminder', 'New student enrolled in Database Design & SQL - Section A', TRUE);

-- ================================================================
-- INSERT AI USER CONTEXT
-- ================================================================

INSERT INTO ai_user_context (user_id, context_json) VALUES
(9, '{"courses": ["Advanced React Development", "Machine Learning Fundamentals", "Database Design"], "current_topics": ["React Hooks", "Linear Regression"], "skill_level": "intermediate", "preferred_learning_style": "hands-on", "recent_struggles": ["useEffect dependencies", "SQL joins"]}'),
(10, '{"courses": ["Advanced React Development", "Machine Learning Fundamentals"], "current_topics": ["Component Optimization", "Data Preprocessing"], "skill_level": "advanced", "preferred_learning_style": "theoretical", "recent_struggles": ["Performance optimization"]}'),
(11, '{"courses": ["Advanced React Development", "Database Design", "Data Structures"], "current_topics": ["React Patterns", "Database Normalization"], "skill_level": "beginner", "preferred_learning_style": "visual", "recent_struggles": ["Complex SQL queries"]}');

-- ================================================================
-- INSERT AI INTERACTIONS
-- ================================================================

INSERT INTO ai_interactions (user_id, query, response) VALUES
(9, 'How do I properly use useEffect with cleanup functions?', 'UseEffect cleanup functions are crucial for preventing memory leaks. Here\'s how to implement them properly: [detailed explanation with code examples]'),
(9, 'What\'s the difference between supervised and unsupervised learning?', 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. [comprehensive explanation with examples]'),

(10, 'How can I optimize React component re-renders?', 'To optimize React re-renders, use React.memo, useMemo, useCallback, and proper state structure. [detailed optimization strategies]'),
(10, 'Explain the concept of overfitting in machine learning', 'Overfitting occurs when a model performs well on training data but poorly on new data. [explanation with prevention techniques]'),

(11, 'Can you explain database normalization with examples?', 'Database normalization eliminates redundancy and ensures data integrity. [step-by-step normalization process with examples]'),
(11, 'What are the different types of SQL joins?', 'SQL joins combine data from multiple tables: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN. [detailed explanation with examples]');

-- ================================================================
-- COMPLETION MESSAGE
-- ================================================================

SELECT 'Database populated successfully with comprehensive fake data!' as message;

-- Verify data insertion
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM courses) as total_courses,
  (SELECT COUNT(*) FROM sections) as total_sections,
  (SELECT COUNT(*) FROM enrollments) as total_enrollments,
  (SELECT COUNT(*) FROM assignments) as total_assignments,
  (SELECT COUNT(*) FROM submissions) as total_submissions,
  (SELECT COUNT(*) FROM chat_messages) as total_messages;