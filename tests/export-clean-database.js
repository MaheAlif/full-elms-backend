const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function exportCleanDatabase() {
  let connection;
  
  try {
    console.log('📦 Exporting Clean Database for Migration...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms'
    });

    console.log('✅ Connected to database\n');

    let sqlContent = `-- ========================================
-- ELMS Database Export - Clean Production Data
-- Generated: ${new Date().toISOString()}
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

`;

    // Get CREATE TABLE statements
    const tables = [
      'users', 'courses', 'sections', 'enrollments', 'announcements',
      'materials', 'assignments', 'submissions', 'calendar_events',
      'university_events', 'chat_rooms', 'chat_messages',
      'notifications', 'ai_user_context', 'ai_interactions'
    ];

    console.log('📋 Exporting table structures...');
    for (const table of tables) {
      const [createTable] = await connection.execute(`SHOW CREATE TABLE ${table}`);
      sqlContent += `-- Table: ${table}\n`;
      sqlContent += createTable[0]['Create Table'] + ';\n\n';
    }

    sqlContent += `-- ========================================
-- INSERT DATA
-- ========================================

`;

    // Export data from each table
    console.log('\n📊 Exporting table data...');

    // Users
    const [users] = await connection.execute('SELECT * FROM users ORDER BY id');
    console.log(`   ✓ Users: ${users.length} records`);
    if (users.length > 0) {
      sqlContent += `-- Users\n`;
      users.forEach(user => {
        const values = [
          user.id,
          connection.escape(user.name),
          connection.escape(user.email),
          connection.escape(user.password_hash),
          connection.escape(user.role),
          user.avatar_url ? connection.escape(user.avatar_url) : 'NULL',
          connection.escape(user.created_at),
          connection.escape(user.updated_at)
        ].join(', ');
        sqlContent += `INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Courses
    const [courses] = await connection.execute('SELECT * FROM courses ORDER BY id');
    console.log(`   ✓ Courses: ${courses.length} records`);
    if (courses.length > 0) {
      sqlContent += `-- Courses\n`;
      courses.forEach(course => {
        const values = [
          course.id,
          connection.escape(course.title),
          connection.escape(course.course_code),
          course.description ? connection.escape(course.description) : 'NULL',
          course.teacher_id || 'NULL',
          course.credits || 3,
          course.semester ? connection.escape(course.semester) : 'NULL',
          course.academic_year ? connection.escape(course.academic_year) : 'NULL',
          course.color ? connection.escape(course.color) : 'NULL',
          connection.escape(course.created_at),
          connection.escape(course.updated_at)
        ].join(', ');
        sqlContent += `INSERT INTO courses (id, title, course_code, description, teacher_id, credits, semester, academic_year, color, created_at, updated_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Sections
    const [sections] = await connection.execute('SELECT * FROM sections ORDER BY id');
    console.log(`   ✓ Sections: ${sections.length} records`);
    if (sections.length > 0) {
      sqlContent += `-- Sections\n`;
      sections.forEach(section => {
        const values = [
          section.id,
          section.course_id,
          connection.escape(section.name),
          section.teacher_id || 'NULL',
          section.max_capacity || 30,
          section.current_enrollment || 0,
          connection.escape(section.created_at)
        ].join(', ');
        sqlContent += `INSERT INTO sections (id, course_id, name, teacher_id, max_capacity, current_enrollment, created_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Enrollments
    const [enrollments] = await connection.execute('SELECT * FROM enrollments ORDER BY id');
    console.log(`   ✓ Enrollments: ${enrollments.length} records`);
    if (enrollments.length > 0) {
      sqlContent += `-- Enrollments\n`;
      enrollments.forEach(enrollment => {
        const values = [
          enrollment.id,
          enrollment.user_id,
          enrollment.section_id,
          connection.escape(enrollment.enrolled_at)
        ].join(', ');
        sqlContent += `INSERT INTO enrollments (id, user_id, section_id, enrolled_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Materials
    const [materials] = await connection.execute('SELECT * FROM materials ORDER BY id');
    console.log(`   ✓ Materials: ${materials.length} records`);
    if (materials.length > 0) {
      sqlContent += `-- Materials\n`;
      materials.forEach(material => {
        const values = [
          material.id,
          material.section_id,
          connection.escape(material.title),
          connection.escape(material.type),
          connection.escape(material.file_path),
          material.size ? connection.escape(material.size) : 'NULL',
          connection.escape(material.upload_date)
        ].join(', ');
        sqlContent += `INSERT INTO materials (id, section_id, title, type, file_path, size, upload_date) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Assignments
    const [assignments] = await connection.execute('SELECT * FROM assignments ORDER BY id');
    console.log(`   ✓ Assignments: ${assignments.length} records`);
    if (assignments.length > 0) {
      sqlContent += `-- Assignments\n`;
      assignments.forEach(assignment => {
        const values = [
          assignment.id,
          assignment.section_id,
          connection.escape(assignment.title),
          assignment.description ? connection.escape(assignment.description) : 'NULL',
          assignment.due_date ? connection.escape(assignment.due_date) : 'NULL',
          assignment.total_marks || 'NULL',
          connection.escape(assignment.created_at)
        ].join(', ');
        sqlContent += `INSERT INTO assignments (id, section_id, title, description, due_date, total_marks, created_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Submissions
    const [submissions] = await connection.execute('SELECT * FROM submissions ORDER BY id');
    console.log(`   ✓ Submissions: ${submissions.length} records`);
    if (submissions.length > 0) {
      sqlContent += `-- Submissions\n`;
      submissions.forEach(submission => {
        const values = [
          submission.id,
          submission.assignment_id,
          submission.student_id,
          connection.escape(submission.file_path),
          connection.escape(submission.submitted_at),
          submission.grade || 'NULL',
          submission.feedback ? connection.escape(submission.feedback) : 'NULL',
          submission.graded_at ? connection.escape(submission.graded_at) : 'NULL',
          submission.graded_by || 'NULL'
        ].join(', ');
        sqlContent += `INSERT INTO submissions (id, assignment_id, student_id, file_path, submitted_at, grade, feedback, graded_at, graded_by) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Calendar Events
    const [calendarEvents] = await connection.execute('SELECT * FROM calendar_events ORDER BY id');
    console.log(`   ✓ Calendar Events: ${calendarEvents.length} records`);
    if (calendarEvents.length > 0) {
      sqlContent += `-- Calendar Events\n`;
      calendarEvents.forEach(event => {
        const values = [
          event.id,
          event.section_id,
          connection.escape(event.title),
          event.description ? connection.escape(event.description) : 'NULL',
          connection.escape(event.date),
          connection.escape(event.type),
          connection.escape(event.created_at)
        ].join(', ');
        sqlContent += `INSERT INTO calendar_events (id, section_id, title, description, date, type, created_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // University Events
    const [universityEvents] = await connection.execute('SELECT * FROM university_events ORDER BY id');
    console.log(`   ✓ University Events: ${universityEvents.length} records`);
    if (universityEvents.length > 0) {
      sqlContent += `-- University Events\n`;
      universityEvents.forEach(event => {
        const values = [
          event.id,
          connection.escape(event.title),
          event.description ? connection.escape(event.description) : 'NULL',
          connection.escape(event.date),
          connection.escape(event.type),
          connection.escape(event.priority),
          connection.escape(event.created_at),
          connection.escape(event.updated_at)
        ].join(', ');
        sqlContent += `INSERT INTO university_events (id, title, description, date, type, priority, created_at, updated_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Chat Rooms
    const [chatRooms] = await connection.execute('SELECT * FROM chat_rooms ORDER BY id');
    console.log(`   ✓ Chat Rooms: ${chatRooms.length} records`);
    if (chatRooms.length > 0) {
      sqlContent += `-- Chat Rooms\n`;
      chatRooms.forEach(room => {
        const values = [
          room.id,
          room.section_id,
          connection.escape(room.name),
          connection.escape(room.created_at)
        ].join(', ');
        sqlContent += `INSERT INTO chat_rooms (id, section_id, name, created_at) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    // Chat Messages (optional - might want to exclude for fresh start)
    const [chatMessages] = await connection.execute('SELECT * FROM chat_messages ORDER BY id LIMIT 100');
    console.log(`   ✓ Chat Messages: ${chatMessages.length} records (limited to 100 most recent)`);
    if (chatMessages.length > 0) {
      sqlContent += `-- Chat Messages (most recent 100)\n`;
      chatMessages.forEach(msg => {
        const values = [
          msg.id,
          msg.room_id,
          msg.sender_id,
          connection.escape(msg.message),
          connection.escape(msg.timestamp),
          msg.message_type ? connection.escape(msg.message_type) : "'text'",
          msg.file_url ? connection.escape(msg.file_url) : 'NULL'
        ].join(', ');
        sqlContent += `INSERT INTO chat_messages (id, room_id, sender_id, message, timestamp, message_type, file_url) VALUES (${values});\n`;
      });
      sqlContent += '\n';
    }

    sqlContent += `-- ========================================
-- RESET AUTO_INCREMENT VALUES
-- ========================================

ALTER TABLE users AUTO_INCREMENT = ${users.length + 1};
ALTER TABLE courses AUTO_INCREMENT = ${courses.length + 1};
ALTER TABLE sections AUTO_INCREMENT = ${sections.length + 1};
ALTER TABLE enrollments AUTO_INCREMENT = ${enrollments.length + 1};
ALTER TABLE materials AUTO_INCREMENT = ${materials.length + 1};
ALTER TABLE assignments AUTO_INCREMENT = ${assignments.length + 1};
ALTER TABLE submissions AUTO_INCREMENT = ${submissions.length + 1};
ALTER TABLE calendar_events AUTO_INCREMENT = ${calendarEvents.length + 1};
ALTER TABLE university_events AUTO_INCREMENT = ${universityEvents.length + 1};
ALTER TABLE chat_rooms AUTO_INCREMENT = ${chatRooms.length + 1};
ALTER TABLE chat_messages AUTO_INCREMENT = ${chatMessages.length + 1};

-- ========================================
-- EXPORT COMPLETED
-- ========================================
-- Total Records:
--   Users: ${users.length}
--   Courses: ${courses.length}
--   Sections: ${sections.length}
--   Enrollments: ${enrollments.length}
--   Materials: ${materials.length}
--   Assignments: ${assignments.length}
--   Submissions: ${submissions.length}
--   Calendar Events: ${calendarEvents.length}
--   University Events: ${universityEvents.length}
--   Chat Rooms: ${chatRooms.length}
--   Chat Messages: ${chatMessages.length}
-- ========================================
`;

    // Write to file
    const outputPath = path.join(__dirname, '..', 'elms_clean_export.sql');
    fs.writeFileSync(outputPath, sqlContent, 'utf8');

    console.log('\n' + '='.repeat(60));
    console.log('✅ EXPORT COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`\n📁 File saved to: ${outputPath}`);
    console.log(`📦 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
    console.log('\n📊 Export Summary:');
    console.log(`   • ${users.length} users`);
    console.log(`   • ${courses.length} courses`);
    console.log(`   • ${sections.length} sections`);
    console.log(`   • ${enrollments.length} enrollments`);
    console.log(`   • ${materials.length} materials`);
    console.log(`   • ${assignments.length} assignments`);
    console.log(`   • ${submissions.length} submissions`);
    console.log(`   • ${calendarEvents.length} calendar events`);
    console.log(`   • ${universityEvents.length} university events`);
    console.log(`   • ${chatRooms.length} chat rooms`);
    console.log(`   • ${chatMessages.length} chat messages (recent 100)`);

    console.log('\n🚀 To use this on another PC:');
    console.log('   1. Install MySQL 8.0+');
    console.log('   2. Run: mysql -u root -p < elms_clean_export.sql');
    console.log('   3. Copy the .env file with correct credentials');
    console.log('   4. Copy the uploads/ folder with materials and submissions');
    console.log('   5. npm install and npm run dev');

  } catch (error) {
    console.error('❌ Error during export:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run export
exportCleanDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
