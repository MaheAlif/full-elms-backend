-- ========================================
-- ELMS Database Export - Clean Production Data
-- Generated: 2025-10-16T19:28:59.960Z
-- Database: elms
-- Purpose: Migration to another PC
-- ========================================

-- Create Database
CREATE DATABASE IF NOT EXISTS elms;
USE elms;

-- ========================================
-- DROP EXISTING TABLES (for clean install)
-- ========================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ai_interactions;
DROP TABLE IF EXISTS ai_user_context;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_rooms;
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS university_events;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- CREATE TABLES
-- ========================================

-- Table: users
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(130) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: courses
CREATE TABLE `courses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `course_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `credits` int(11) DEFAULT 3,
  `semester` enum('Fall','Spring','Summer') DEFAULT 'Fall',
  `academic_year` varchar(9) DEFAULT '2024-2025',
  `teacher_id` bigint(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `teacher_id` (`teacher_id`),
  KEY `idx_course_code` (`course_code`),
  KEY `idx_semester_year` (`semester`,`academic_year`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: sections
CREATE TABLE `sections` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL COMMENT 'Teacher assigned to this section',
  `name` varchar(100) NOT NULL,
  `max_capacity` int(11) DEFAULT 50 COMMENT 'Maximum students allowed in this section',
  `current_enrollment` int(11) DEFAULT 0 COMMENT 'Current number of enrolled students',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `idx_teacher_id` (`teacher_id`),
  CONSTRAINT `fk_sections_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: enrollments
CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `section_id` bigint(20) DEFAULT NULL,
  `enrolled_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_course` (`user_id`,`course_id`),
  UNIQUE KEY `unique_user_section` (`user_id`,`section_id`),
  KEY `course_id` (`course_id`),
  KEY `idx_section_user` (`section_id`,`user_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: announcements
CREATE TABLE `announcements` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: materials
CREATE TABLE `materials` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('pdf','doc','ppt','video','other') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `upload_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: assignments
CREATE TABLE `assignments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `total_marks` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: submissions
CREATE TABLE `submissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `grade` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  `graded_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `student_id` (`student_id`),
  KEY `graded_by` (`graded_by`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: calendar_events
CREATE TABLE `calendar_events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` enum('assignment','exam','meeting','class') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  KEY `idx_calendar_events_date` (`date`),
  CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: university_events
CREATE TABLE `university_events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('holiday','exam_week','registration','orientation','graduation','maintenance','event') NOT NULL,
  `priority` enum('low','normal','high') DEFAULT 'normal',
  `created_by` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_university_events_date` (`date`),
  KEY `idx_university_events_type` (`type`),
  CONSTRAINT `university_events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: chat_rooms
CREATE TABLE `chat_rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: chat_messages
CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `room_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `message` text DEFAULT NULL,
  `message_type` enum('text','image','file') NOT NULL DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: notifications
CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `type` enum('assignment','due_event','reminder','grade_posted') NOT NULL,
  `message` text DEFAULT NULL,
  `read_status` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: ai_user_context
CREATE TABLE `ai_user_context` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `context_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`context_json`)),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ai_user_context_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: ai_interactions
CREATE TABLE `ai_interactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `query` text DEFAULT NULL,
  `response` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ai_interactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- INSERT DATA
-- ========================================

-- Users
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (1, 'Dr. Aminul Islam', 'admin.aminul@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'admin', 'https://i.pravatar.cc/150?img=1', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (2, 'Prof. Rashida Khatun', 'admin.rashida@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'admin', 'https://i.pravatar.cc/150?img=2', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (3, 'Dr. Sarah Johnson', 'sarah.johnson@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=3', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (4, 'Prof. Michael Chen', 'michael.chen@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=4', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (5, 'Dr. Emily Rodriguez', 'emily.rodriguez@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=5', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (6, 'Prof. David Kim', 'david.kim@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=6', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (7, 'Dr. Fatima Rahman', 'fatima.rahman@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=7', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (8, 'Prof. Ahmed Hassan', 'ahmed.hassan@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=8', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (9, 'Sakib Islam', 'sakib221131@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=9', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (10, 'Fatima Akter', 'fatima221132@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=10', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (11, 'Ariful Haque', 'ariful221133@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=11', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (12, 'Nusrat Jahan', 'nusrat221134@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=12', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (13, 'Rafiqul Islam', 'rafiqul221135@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=13', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (14, 'Taslima Khatun', 'taslima221136@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=14', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (15, 'Mohammad Ali', 'mohammad221137@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=15', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (16, 'Rashida Begum', 'rashida221138@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=16', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (17, 'Aminul Islam', 'aminul221139@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=17', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (18, 'Salma Akter', 'salma221140@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=18', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (19, 'Karim Rahman', 'karim221141@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=19', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (20, 'Nasreen Sultana', 'nasreen221142@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=20', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (21, 'Jahangir Alam', 'jahangir221143@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=21', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (22, 'Rubina Yasmin', 'rubina221144@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=22', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (23, 'Shahin Ahmed', 'shahin221145@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=23', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (24, 'Rokeya Khatun', 'rokeya221146@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=24', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (25, 'Habibur Rahman', 'habibur221147@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=25', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (26, 'Sultana Rajia', 'sultana221148@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=26', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (27, 'Abdullah Al Mamun', 'abdullah221149@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=27', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (28, 'Marium Akter', 'marium221150@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=28', '2025-09-30 19:01:16.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (29, 'Test User', 'test@student.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-01 11:16:11.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (30, 'Debug User', 'debug-test@student.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-01 11:46:02.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (31, 'Golam Rabbani', 'golam.rabbani@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', NULL, '2025-10-13 19:27:47.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (32, 'Mahe Alif', 'mahe221130@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-13 19:29:20.000', '2025-10-13 20:46:12.000');
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (33, 'Mark Protik', 'mark221129@bscse.uiu.ac.bd', '$2b$10$kBmyIIP85k/Fk13LncEkl.DA97hmC.1z8L9/kYyyMzG2SxEqYl3Pa', 'student', NULL, '2025-10-16 21:02:23.000', '2025-10-16 21:02:23.000');

-- Courses
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (1, 'Advanced React Development', 'CSE-4101', 'Deep dive into React hooks, context, performance optimization, and modern patterns', 3, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-cyan-500 to-blue-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (2, 'Machine Learning Fundamentals', 'CSE-4201', 'Introduction to ML algorithms, data science, and practical applications', 4, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-purple-500 to-pink-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (3, 'Database Design & SQL', 'CSE-3301', 'Relational database concepts, advanced SQL queries, and optimization techniques', 31, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-green-500 to-teal-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (4, 'Web Security & Cryptography', 'CSE-4401', 'Modern web security practices, cryptographic protocols, and ethical hacking', 6, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-orange-500 to-red-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (5, 'Data Structures & Algorithms', 'CSE-2501', 'Advanced data structures, algorithm design, and complexity analysis', 7, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-indigo-500 to-purple-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (6, 'Software Engineering Principles', 'CSE-3601', 'Software development lifecycle, design patterns, and project management', 8, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-yellow-500 to-orange-500', '2025-09-30 19:01:16.000', '2025-10-15 00:52:24.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (7, 'Biology', 'Bio-201', 'Teaches biology for Engineers', 3, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-03 18:28:17.000', '2025-10-15 00:17:21.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (8, 'Psychology', 'Psy-231', 'It\'s about psychology, you know how human behaves', 5, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-03 18:35:45.000', '2025-10-03 18:36:01.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (9, 'Data Structures and Algorithms', 'CSE-2201', 'Data Structures and Algorithms (DSA) is a fundamental part of Computer Science that teaches you how to think and solve complex problems systematically. Using the right data structure and algorithm makes your program run faster, especially when working with lots of data.', 3, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-16 19:10:37.000', '2025-10-16 19:11:08.000');
INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (10, 'Economics', 'ECO-2011', 'An economics course provides a framework for understanding how societies use scarce resources and covers topics like microeconomics, macroeconomics, econometrics, and public policy', 5, 3, 'Fall', '2024-2025', 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-16 22:04:09.000', '2025-10-17 01:27:28.000');

-- Sections
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (1, 1, 'CSE 4101 - Section A', 3, 50, 11, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (2, 1, 'CSE 4101 - Section B', 3, 50, 10, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (3, 2, 'CSE 4201 - Section A', 4, 50, 11, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (4, 2, 'CSE 4201 - Section B', 4, 50, 10, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (5, 3, 'CSE 3301 - Section A', 31, 50, 11, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (6, 4, 'CSE 4401 - Section A', 6, 50, 8, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (7, 5, 'CSE 2501 - Section A', 7, 50, 6, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (8, 5, 'CSE 2501 - Section B', 7, 50, 6, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (9, 6, 'CSE 3601 - Section A', 8, 50, 8, '2025-09-30 19:01:16.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (10, 7, 'Bio-201 - Section A', 3, 50, 4, '2025-10-15 01:22:41.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (11, 8, 'Psy-231 - Section A', 5, 50, 2, '2025-10-16 19:30:42.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (12, 9, 'CSE-2201 - Section A', 3, 50, 5, '2025-10-16 19:30:42.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (14, 7, 'Bio-201 - Section B', 7, 50, 3, '2025-10-16 20:37:52.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (15, 10, 'A', 3, 50, 4, '2025-10-16 22:04:22.000');
INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (16, 8, 'B', 3, 10, 2, '2025-10-17 00:11:53.000');

-- Enrollments
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (1, 9, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (2, 10, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (3, 11, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (4, 12, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (5, 13, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (6, 14, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (7, 15, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (8, 16, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (9, 17, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (10, 18, 1, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (11, 19, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (12, 20, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (13, 21, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (14, 22, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (15, 23, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (16, 24, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (17, 25, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (18, 26, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (19, 27, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (20, 28, 2, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (21, 9, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (22, 11, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (23, 13, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (24, 15, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (25, 17, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (26, 19, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (27, 21, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (28, 23, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (29, 25, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (30, 27, 3, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (31, 10, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (32, 12, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (33, 14, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (34, 16, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (35, 18, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (36, 20, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (37, 22, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (38, 24, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (39, 26, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (40, 28, 4, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (41, 9, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (42, 10, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (43, 11, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (44, 12, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (45, 19, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (46, 20, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (47, 21, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (48, 22, 5, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (49, 13, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (50, 14, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (51, 15, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (52, 16, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (53, 23, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (54, 24, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (55, 25, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (56, 26, 6, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (57, 17, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (58, 18, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (59, 27, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (60, 28, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (61, 9, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (62, 10, 7, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (63, 19, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (64, 20, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (65, 21, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (66, 22, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (67, 11, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (68, 12, 8, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (69, 23, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (70, 24, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (71, 25, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (72, 26, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (73, 13, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (74, 14, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (75, 15, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (76, 16, 9, '2025-09-30 19:01:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (77, 30, 10, '2025-10-03 18:30:17.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (78, 29, 11, '2025-10-03 18:36:31.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (79, 17, 11, '2025-10-03 18:36:59.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (80, 17, 10, '2025-10-03 19:32:25.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (81, 17, 5, '2025-10-03 19:44:44.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (82, 30, 5, '2025-10-03 19:44:56.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (83, 16, 5, '2025-10-03 19:45:06.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (90, 32, 1, '2025-10-13 23:41:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (91, 32, 3, '2025-10-13 23:41:16.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (92, 18, 10, '2025-10-14 02:54:57.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (93, 32, 10, '2025-10-15 01:22:41.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (94, 32, 12, '2025-10-16 19:11:20.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (95, 18, 12, '2025-10-16 19:11:31.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (96, 17, 12, '2025-10-16 19:11:41.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (97, 16, 12, '2025-10-16 19:11:50.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (98, 15, 12, '2025-10-16 19:11:59.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (99, 29, 14, '2025-10-16 20:51:44.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (100, 11, 14, '2025-10-16 20:55:14.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (101, 33, 14, '2025-10-16 21:02:41.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (102, 33, 15, '2025-10-16 22:05:01.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (103, 32, 15, '2025-10-16 22:05:17.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (104, 18, 15, '2025-10-16 22:05:39.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (105, 17, 15, '2025-10-16 22:05:51.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (106, 33, 16, '2025-10-17 00:13:51.000');
INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (107, 32, 16, '2025-10-17 00:14:26.000');

-- Materials
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (19, 1, 'New PDF for React', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\à§§à§¦à¦® à¦¶à§à¦°à§à¦£à§ à¦¬à¦¾à¦à¦²à¦¾ à§¨à§ à¦ªà¦¤à§à¦°-1760367086163-801090339.pdf', '32072', '2025-10-13 20:51:26.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (20, 1, 'Test pdf', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Git_Exam_CheatSheet-1760370124869-409554123.pdf', '3788', '2025-10-13 21:42:04.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (21, 1, 'Test-2 PDF', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Git_Lab_Manual-1760370583602-198120720.pdf', '162630', '2025-10-13 21:49:43.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (22, 1, '50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced-1760371201561-298032114.pdf', '774529', '2025-10-13 22:00:01.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (23, 10, 'New Book for Cells', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\1_Fundamentals of Cell-1760471416626-52438030.pdf', '1834808', '2025-10-15 01:50:16.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (24, 15, 'New Book', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Equilibrium Under Monopoly-1760632601148-464913508.pdf', '226458', '2025-10-16 22:36:41.000');
INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (25, 16, 'TT-1', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\3. (PSY) chapter six LEARNING-1760638638517-787405809.pdf', '4130461', '2025-10-17 00:17:18.000');

-- Assignments
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (13, 1, 'test-1', 'it\'s a test to see if the assignment is published! Please WORK!', '2025-10-30 16:42:00.000', 100, '2025-10-13 22:42:11.000');
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (14, 10, 'Biology A-1 Lab', 'Test assignment', '2025-10-27 18:22:00.000', 100, '2025-10-15 00:23:01.000');
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (15, 10, 'Biology Lab Report', 'Write a comprehensive lab report on plant cell structure and function.', '2025-10-25 23:59:00.000', 100, '2025-10-15 01:22:41.000');
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (16, 10, 'Report on Human Cell', 'Read the pdf I uploaded and wirte a report about Human Cell. Tell me what you understand.', '2025-10-30 19:51:00.000', 100, '2025-10-15 01:51:29.000');
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (18, 15, 'T-1', 'Do it', '2025-10-27 16:36:00.000', 100, '2025-10-16 22:37:00.000');
INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (19, 16, 'A-TT-1', 'Read the new book and write a report on it', '2025-10-18 18:17:00.000', 10, '2025-10-17 00:18:04.000');

-- Submissions
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (19, 13, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced (1)-1760382167399-932678554.pdf', '2025-10-14 01:02:47.000', 80, 'good, but needs improvement', '2025-10-14 02:22:27.000', 3);
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (21, 13, 18, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\BDRAILWAY_TICKET417151171140-71433-461311-1161214-301416713127171011-1760388949824-865721813.pdf', '2025-10-14 02:55:49.000', 50, 'Needs more work!', '2025-10-14 02:56:27.000', 3);
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (22, 14, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Mahe Alif_test-1-1760470928749-96804274.pdf', '2025-10-15 01:42:08.000', 55, 'Needs more attention', '2025-10-15 01:43:14.000', 3);
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (23, 16, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Final term Question Bank (1)-1760471598556-335130722.pdf', '2025-10-15 01:53:18.000', 80, 'Good job', '2025-10-15 01:55:13.000', 3);
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (24, 19, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Mahe Alif_test-1-1760638808191-311450421.pdf', '2025-10-17 00:20:08.000', 9, 'Very good', '2025-10-17 01:18:17.000', 3);
INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (25, 19, 33, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Equilibrium Under Monopoly-1760632601148-464913508-1760638969005-695141580.pdf', '2025-10-17 00:22:49.000', NULL, NULL, NULL, NULL);

-- Calendar Events
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (19, 1, 'Assignment Due: Biology A-1', 'Assignment \"Biology A-1\" submission deadline', '2025-10-27 00:00:00.000', 'assignment', '2025-10-15 00:23:01.000');
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (20, 10, 'Assignment Due: Biology A-1 Lab', 'Biology lab report assignment deadline', '2025-10-27 00:00:00.000', 'assignment', '2025-10-15 01:22:41.000');
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (21, 10, 'Assignment Due: Report on Human Cell', 'Assignment \"Report on Human Cell\" submission deadline', '2025-10-30 00:00:00.000', 'assignment', '2025-10-15 01:51:29.000');
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (22, 15, 'Assignment Due: Economics Test Assignment', 'Assignment \"Economics Test Assignment\" submission deadline', '2025-10-23 00:00:00.000', 'assignment', '2025-10-16 22:36:09.000');
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (23, 15, 'Assignment Due: T-1', 'Assignment \"T-1\" submission deadline', '2025-10-27 00:00:00.000', 'assignment', '2025-10-16 22:37:00.000');
INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (24, 16, 'Assignment Due: A-TT-1', 'Assignment \"A-TT-1\" submission deadline', '2025-10-18 00:00:00.000', 'assignment', '2025-10-17 00:18:04.000');

-- University Events
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (1, 'Fall Semester Registration', 'Online registration opens for Fall 2025 semester. Students must complete course selection by the deadline.', '2025-08-15 00:00:00.000', 'registration', 'high', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (2, 'Mid-term Exam Week', 'Mid-term examinations for all courses. No regular classes scheduled during this period.', '2025-10-14 00:00:00.000', 'exam_week', 'high', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (3, 'Independence Day Holiday', 'University closed in observance of Independence Day. All classes and offices closed.', '2025-03-26 00:00:00.000', 'holiday', 'normal', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (4, 'New Student Orientation', 'Mandatory orientation session for all newly admitted students. Campus tour and academic guidelines.', '2025-09-01 00:00:00.000', 'orientation', 'high', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (5, 'System Maintenance', 'Scheduled maintenance of university IT systems. Online services may be temporarily unavailable.', '2025-11-15 00:00:00.000', 'maintenance', 'normal', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (6, 'Annual Sports Day', 'University-wide sports competition and cultural activities. All students and faculty invited.', '2025-12-10 00:00:00.000', 'event', 'normal', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (7, 'Final Exam Period', 'Final examinations for Fall 2025 semester. Students must check exam schedules on the portal.', '2025-12-15 00:00:00.000', 'exam_week', 'high', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');
INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (8, 'Winter Break Begins', 'Winter vacation starts. University closed until next semester.', '2025-12-25 00:00:00.000', 'holiday', 'normal', '2025-10-14 22:58:28.000', '2025-10-14 22:58:28.000');

-- Chat Rooms
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (1, 1, 'React Dev - Section A Discussion', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (2, 2, 'React Dev - Section B Discussion', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (3, 3, 'ML Fundamentals - Section A', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (4, 4, 'ML Fundamentals - Section B', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (5, 5, 'Database Design Discussion', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (6, 6, 'Web Security Forum', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (7, 7, 'Data Structures - Section A', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (8, 8, 'Data Structures - Section B', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (9, 9, 'Software Engineering Chat', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (10, 10, 'Bio-201 - Section A Chat', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (11, 12, 'CSE-2201 - Section A Chat', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (12, 14, 'Bio-201 - Section B Chat', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (13, 15, 'A Chat', NULL);
INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (14, 16, 'B Chat', NULL);

-- Chat Messages (most recent 100)
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (1, 1, 9, 'Has anyone started working on the React hooks assignment yet?', '2024-10-10 10:30:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (2, 1, 10, 'Yes, I\'m working on the useState part. The useEffect is a bit tricky though.', '2024-10-10 10:32:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (3, 1, 3, 'Remember that useEffect runs after every render by default. Make sure to include the dependency array!', '2024-10-10 10:35:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (4, 1, 11, 'Thanks Dr. Johnson! That clears up the confusion.', '2024-10-10 10:37:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (5, 1, 12, 'Don\'t forget the submission deadline is tomorrow at 11:59 PM!', '2024-10-10 11:00:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (6, 1, 13, 'Can we use external libraries like Material-UI for styling?', '2024-10-10 11:15:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (7, 1, 3, 'Yes, you can use any UI library, but focus on implementing the hooks correctly.', '2024-10-10 11:18:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (8, 3, 15, 'The linear regression dataset is quite large. Any tips for preprocessing?', '2024-10-09 14:20:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (9, 3, 17, 'I used pandas for data cleaning. Check for null values and outliers first.', '2024-10-09 14:25:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (10, 3, 4, 'Good advice! Also normalize your features for better convergence.', '2024-10-09 14:30:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (11, 3, 19, 'Should we implement gradient descent from scratch or use built-in functions?', '2024-10-09 14:45:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (12, 3, 4, 'Implement from scratch first to understand the math, then compare with sklearn.', '2024-10-09 14:50:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (13, 5, 9, 'Anyone having trouble with the foreign key constraints in the e-commerce schema?', '2024-10-08 16:10:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (14, 5, 21, 'Make sure your referenced columns have the same data type and are indexed.', '2024-10-08 16:15:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (15, 5, 5, 'Great discussion! Remember to consider cascading deletes and updates carefully.', '2024-10-08 16:20:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (16, 5, 22, 'Dr. Rodriguez, should we include audit tables for tracking changes?', '2024-10-08 16:25:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (17, 5, 5, 'That\'s an excellent idea for a production system! Bonus points if you implement it.', '2024-10-08 16:30:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (18, 6, 23, 'The OWASP Top 10 list is really eye-opening. SQL injection is everywhere!', '2024-10-07 13:40:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (19, 6, 25, 'I found three SQL injection vulnerabilities in the test application already.', '2024-10-07 13:45:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (20, 6, 6, 'Excellent work! Make sure to document the impact and remediation steps.', '2024-10-07 13:50:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (21, 6, 24, 'Prof. Kim, will we cover XSS prevention techniques in the next class?', '2024-10-07 14:00:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (22, 6, 6, 'Yes, we\'ll cover XSS, CSRF, and secure coding practices next week.', '2024-10-07 14:05:00.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (24, 1, 32, 'Ok maam', '2025-10-16 19:38:14.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (25, 11, 32, 'dsa', '2025-10-16 19:39:32.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (26, 10, 32, 'Biology', '2025-10-16 19:39:43.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (27, 3, 32, 'Ml is great!!!!', '2025-10-16 19:40:53.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (29, 1, 10, 'Hello Mahe Alif', '2025-10-16 19:45:50.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (30, 7, 10, 'Anyone here?', '2025-10-16 19:45:59.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (31, 1, 32, 'Hello Fatima', '2025-10-16 19:46:57.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (32, 10, 32, 'Hello my mates? I hate Biology', '2025-10-16 20:32:25.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (34, 12, 33, 'Hello, I am Mark', '2025-10-16 21:03:39.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (35, 12, 29, 'Hello, I am a test user. I hate Biology', '2025-10-16 21:05:03.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (36, 12, 33, 'Yeah, I hate it too', '2025-10-16 21:10:56.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (37, 12, 29, 'It\'s a good thing to hate Biology', '2025-10-16 21:32:55.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (38, 13, 33, 'Hello bro?', '2025-10-16 22:19:05.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (39, 13, 32, 'Yep, chat is working!', '2025-10-16 22:19:56.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (40, 13, 32, 'Hello mark', '2025-10-17 00:21:39.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (41, 14, 32, 'Hello', '2025-10-17 00:21:58.000', 'text', NULL);
INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (42, 14, 33, 'Hello Mahe', '2025-10-17 00:23:16.000', 'text', NULL);

-- ========================================
-- RESET AUTO_INCREMENT VALUES
-- ========================================

ALTER TABLE users AUTO_INCREMENT = 34;
ALTER TABLE courses AUTO_INCREMENT = 11;
ALTER TABLE sections AUTO_INCREMENT = 16;
ALTER TABLE enrollments AUTO_INCREMENT = 102;
ALTER TABLE materials AUTO_INCREMENT = 8;
ALTER TABLE assignments AUTO_INCREMENT = 7;
ALTER TABLE submissions AUTO_INCREMENT = 7;
ALTER TABLE calendar_events AUTO_INCREMENT = 7;
ALTER TABLE university_events AUTO_INCREMENT = 9;
ALTER TABLE chat_rooms AUTO_INCREMENT = 15;
ALTER TABLE chat_messages AUTO_INCREMENT = 40;

-- ========================================
-- EXPORT COMPLETED
-- ========================================
-- Total Records:
--   Users: 33
--   Courses: 10
--   Sections: 15
--   Enrollments: 101
--   Materials: 7
--   Assignments: 6
--   Submissions: 6
--   Calendar Events: 6
--   University Events: 8
--   Chat Rooms: 14
--   Chat Messages: 39
-- ========================================
