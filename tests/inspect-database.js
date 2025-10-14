const mysql = require('mysql2/promise');
require('dotenv').config();

async function inspectDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms'
    });

    console.log('🔍 FULL DATABASE INSPECTION');
    console.log('=' .repeat(80));

    // 1. Users Table
    console.log('\n👥 USERS:');
    console.log('-'.repeat(60));
    const [users] = await connection.execute(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY role, name
    `);
    users.forEach(user => {
      const role = (user.role || 'N/A').toString().toUpperCase().padEnd(8);
      const name = (user.name || 'N/A').toString().padEnd(25);
      const email = user.email || 'N/A';
      console.log(`ID: ${user.id} | ${role} | ${name} | ${email}`);
    });

    // 2. Courses Table
    console.log('\n📚 COURSES:');
    console.log('-'.repeat(60));
    const [courses] = await connection.execute(`
      SELECT c.id, c.title, c.course_code, c.description, c.credits, 
             c.semester, c.academic_year, u.name as teacher_name
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY c.id
    `);
    courses.forEach(course => {
      const courseCode = (course.course_code || 'N/A').toString().padEnd(10);
      const courseTitle = (course.title || 'N/A').toString().padEnd(30);
      const teacherName = course.teacher_name || 'None';
      console.log(`ID: ${course.id} | ${courseCode} | ${courseTitle} | Teacher: ${teacherName}`);
      if (course.description) {
        console.log(`    Description: ${course.description.substring(0, 80)}${course.description.length > 80 ? '...' : ''}`);
      }
    });

    // 3. Sections Table
    console.log('\n📖 SECTIONS:');
    console.log('-'.repeat(60));
    const [sections] = await connection.execute(`
      SELECT s.id, s.name as section_name, s.course_id, c.title as course_name, c.course_code
      FROM sections s
      JOIN courses c ON s.course_id = c.id
      ORDER BY s.id
    `);
    sections.forEach(section => {
      const sectionName = (section.section_name || 'N/A').toString().padEnd(20);
      const courseCode = section.course_code || 'N/A';
      const courseName = section.course_name || 'N/A';
      console.log(`Section ID: ${section.id} | ${sectionName} | Course: ${courseCode} - ${courseName}`);
    });

    // 4. Enrollments Table
    console.log('\n🎓 ENROLLMENTS:');
    console.log('-'.repeat(60));
    const [enrollments] = await connection.execute(`
      SELECT e.id, e.user_id, e.section_id, e.enrolled_at,
             u.name as student_name, u.email as student_email,
             s.name as section_name, c.title as course_name, c.course_code
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      ORDER BY u.name, c.course_code
    `);
    enrollments.forEach(enrollment => {
      const studentName = (enrollment.student_name || 'N/A').toString().padEnd(25);
      const sectionName = (enrollment.section_name || 'N/A').toString().padEnd(15);
      const courseCode = enrollment.course_code || 'N/A';
      const courseName = enrollment.course_name || 'N/A';
      console.log(`Student: ${studentName} | Section: ${sectionName} | Course: ${courseCode} - ${courseName}`);
      console.log(`    Enrolled: ${enrollment.enrolled_at} | Section ID: ${enrollment.section_id} | User ID: ${enrollment.user_id}`);
    });

    // 5. Assignments Table
    console.log('\n📝 ASSIGNMENTS:');
    console.log('-'.repeat(60));
    const [assignments] = await connection.execute(`
      SELECT a.id, a.title, a.description, a.due_date, a.total_marks, a.section_id,
             s.name as section_name, c.title as course_name, c.course_code,
             u.name as teacher_name
      FROM assignments a
      JOIN sections s ON a.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY a.due_date
    `);
    assignments.forEach(assignment => {
      const title = (assignment.title || 'N/A').toString().padEnd(30);
      const courseCode = assignment.course_code || 'N/A';
      const courseName = assignment.course_name || 'N/A';
      const sectionName = assignment.section_name || 'N/A';
      const teacherName = assignment.teacher_name || 'N/A';
      console.log(`ID: ${assignment.id} | ${title} | Due: ${assignment.due_date}`);
      console.log(`    Course: ${courseCode} - ${courseName} | Section: ${sectionName} (ID: ${assignment.section_id})`);
      console.log(`    Teacher: ${teacherName} | Marks: ${assignment.total_marks}`);
      if (assignment.description) {
        console.log(`    Description: ${assignment.description.substring(0, 80)}${assignment.description.length > 80 ? '...' : ''}`);
      }
    });

    // 6. Materials Table
    console.log('\n📄 MATERIALS:');
    console.log('-'.repeat(60));
    const [materials] = await connection.execute(`
      SELECT m.id, m.title, m.type, m.file_path, m.size, m.upload_date, m.section_id,
             s.name as section_name, c.title as course_name, c.course_code,
             u.name as teacher_name
      FROM materials m
      JOIN sections s ON m.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY m.upload_date DESC
    `);
    if (materials.length === 0) {
      console.log('No materials found in database');
    } else {
      materials.forEach(material => {
        const title = (material.title || 'N/A').toString().padEnd(30);
        const type = material.type || 'N/A';
        const size = material.size || 'N/A';
        const courseCode = material.course_code || 'N/A';
        const courseName = material.course_name || 'N/A';
        const sectionName = material.section_name || 'N/A';
        console.log(`ID: ${material.id} | ${title} | Type: ${type} | Size: ${size}`);
        console.log(`    Course: ${courseCode} - ${courseName} | Section: ${sectionName} (ID: ${material.section_id})`);
        console.log(`    Teacher: ${material.teacher_name} | Uploaded: ${material.upload_date}`);
        console.log(`    File: ${material.file_path}`);
      });
    }

    // 7. Submissions Table
    console.log('\n📤 SUBMISSIONS:');
    console.log('-'.repeat(60));
    const [submissions] = await connection.execute(`
      SELECT s.id, s.assignment_id, s.student_id, s.file_path, s.submitted_at, s.grade, s.feedback,
             a.title as assignment_title, u.name as student_name, c.course_code
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON s.student_id = u.id
      JOIN sections sec ON a.section_id = sec.id
      JOIN courses c ON sec.course_id = c.id
      ORDER BY s.submitted_at DESC
    `);
    if (submissions.length === 0) {
      console.log('No submissions found in database');
    } else {
      submissions.forEach(submission => {
        const studentName = (submission.student_name || 'N/A').toString().padEnd(25);
        const assignmentTitle = submission.assignment_title || 'N/A';
        const courseCode = submission.course_code || 'N/A';
        const grade = submission.grade || 'Not graded';
        console.log(`Student: ${studentName} | Assignment: ${assignmentTitle}`);
        console.log(`    Course: ${courseCode} | Submitted: ${submission.submitted_at} | Grade: ${grade}`);
        console.log(`    File: ${submission.file_path}`);
      });
    }

    // 8. University Events Table
    console.log('\n🏫 UNIVERSITY EVENTS:');
    console.log('-'.repeat(60));
    const [universityEvents] = await connection.execute(`
      SELECT id, title, description, date, type, priority, created_at
      FROM university_events
      ORDER BY date
    `);
    if (universityEvents.length === 0) {
      console.log('No university events found in database');
    } else {
      universityEvents.forEach(event => {
        const title = (event.title || 'N/A').toString().padEnd(30);
        const type = event.type || 'N/A';
        const priority = event.priority || 'N/A';
        console.log(`ID: ${event.id} | ${title} | Date: ${event.date} | Type: ${type} | Priority: ${priority}`);
        if (event.description) {
          console.log(`    Description: ${event.description.substring(0, 80)}${event.description.length > 80 ? '...' : ''}`);
        }
      });
    }

    // 9. Calendar Events Table
    console.log('\n📅 CALENDAR EVENTS:');
    console.log('-'.repeat(60));
    const [calendarEvents] = await connection.execute(`
      SELECT ce.id, ce.title, ce.description, ce.date, ce.type, ce.section_id,
             s.name as section_name, c.course_code, c.title as course_name
      FROM calendar_events ce
      JOIN sections s ON ce.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      ORDER BY ce.date
    `);
    if (calendarEvents.length === 0) {
      console.log('No calendar events found in database');
    } else {
      calendarEvents.forEach(event => {
        const title = (event.title || 'N/A').toString().padEnd(30);
        const type = event.type || 'N/A';
        const courseCode = event.course_code || 'N/A';
        const courseName = event.course_name || 'N/A';
        const sectionName = event.section_name || 'N/A';
        console.log(`ID: ${event.id} | ${title} | Date: ${event.date} | Type: ${type}`);
        console.log(`    Course: ${courseCode} - ${courseName} | Section: ${sectionName} (ID: ${event.section_id})`);
      });
    }

    // 10. Focus on Mahe Alif specifically
    console.log('\n🎯 MAHE ALIF SPECIFIC DATA:');
    console.log('-'.repeat(60));
    
    // Find Mahe Alif
    const [maheUser] = await connection.execute(`
      SELECT id, name, email, role FROM users WHERE name LIKE '%Mahe%' OR email LIKE '%mahe%'
    `);
    
    if (maheUser.length === 0) {
      console.log('❌ Mahe Alif not found in database');
    } else {
      const mahe = maheUser[0];
      console.log(`✅ Found Mahe Alif: ID ${mahe.id}, Email: ${mahe.email}, Role: ${mahe.role}`);
      
      // Get Mahe's enrollments
      const [maheEnrollments] = await connection.execute(`
        SELECT e.id, e.section_id, e.enrolled_at,
               s.name as section_name, c.id as course_id, c.title as course_name, c.course_code,
               u.name as teacher_name
        FROM enrollments e
        JOIN sections s ON e.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE e.user_id = ?
        ORDER BY c.course_code
      `, [mahe.id]);
      
      console.log(`\n📚 Mahe's Enrollments (${maheEnrollments.length} total):`);
      maheEnrollments.forEach(enrollment => {
        console.log(`  - Course ID: ${enrollment.course_id} | ${enrollment.course_code} - ${enrollment.course_name}`);
        console.log(`    Section: ${enrollment.section_name} (ID: ${enrollment.section_id}) | Teacher: ${enrollment.teacher_name}`);
        console.log(`    Enrolled: ${enrollment.enrolled_at}`);
      });
      
      // Get assignments available to Mahe
      const [maheAssignments] = await connection.execute(`
        SELECT a.id, a.title, a.due_date, a.total_marks,
               c.course_code, c.title as course_name, s.name as section_name,
               u.name as teacher_name
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        JOIN enrollments e ON s.id = e.section_id
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE e.user_id = ?
        ORDER BY a.due_date
      `, [mahe.id]);
      
      console.log(`\n📝 Assignments Available to Mahe (${maheAssignments.length} total):`);
      if (maheAssignments.length === 0) {
        console.log('  No assignments found');
      } else {
        maheAssignments.forEach(assignment => {
          console.log(`  - ${assignment.title} (ID: ${assignment.id}) | Due: ${assignment.due_date} | Marks: ${assignment.total_marks}`);
          console.log(`    Course: ${assignment.course_code} - ${assignment.course_name} | Teacher: ${assignment.teacher_name}`);
        });
      }
    }

    await connection.end();
    console.log('\n' + '='.repeat(80));
    console.log('🎉 Database inspection complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

inspectDatabase();