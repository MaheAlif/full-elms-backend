const mysql = require('mysql2/promise');
require('dotenv').config();

async function investigateEnrollmentMismatch() {
  try {
    console.log('🔍 INVESTIGATING ENROLLMENT MISMATCH FOR MAHE ALIF');
    console.log('=' .repeat(70));
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // 1. Get Mahe's user info
    console.log('\n👤 MAHE ALIF USER INFO:');
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['mahe221130@bscse.uiu.ac.bd']
    );
    console.log('User Data:', users[0]);

    // 2. Check raw enrollments table for Mahe
    console.log('\n📚 RAW ENROLLMENTS TABLE FOR MAHE (ID: 32):');
    const [rawEnrollments] = await connection.execute(
      'SELECT * FROM enrollments WHERE student_id = ? ORDER BY enrolled_at DESC',
      [32]
    );
    console.log('Total enrollments found:', rawEnrollments.length);
    rawEnrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. Section ID: ${enrollment.section_id}, Enrolled: ${enrollment.enrolled_at}`);
    });

    // 3. Check what sections these enrollment IDs point to
    console.log('\n🎯 DETAILED SECTION ANALYSIS:');
    for (const enrollment of rawEnrollments) {
      const [sectionInfo] = await connection.execute(`
        SELECT s.id as section_id, s.name as section_name, s.course_id,
               c.course_code, c.title as course_title, c.description
        FROM sections s
        JOIN courses c ON s.course_id = c.id
        WHERE s.id = ?
      `, [enrollment.section_id]);
      
      if (sectionInfo.length > 0) {
        const section = sectionInfo[0];
        console.log(`Section ${enrollment.section_id}: ${section.course_code} - ${section.course_title}`);
        console.log(`  Section Name: ${section.section_name}`);
        console.log(`  Enrolled At: ${enrollment.enrolled_at}`);
      } else {
        console.log(`❌ Section ${enrollment.section_id}: NOT FOUND!`);
      }
    }

    // 4. Check what the student API returns (simulating the API call)
    console.log('\n🔌 SIMULATING STUDENT API CALL:');
    const [studentApiResult] = await connection.execute(`
      SELECT DISTINCT c.id as course_id, c.course_code, c.title as course_name, c.description,
             s.id as section_id, s.name as section_name,
             u.name as teacher_name, e.enrolled_at
      FROM enrollments e
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE e.student_id = ?
      ORDER BY e.enrolled_at DESC
    `, [32]);

    console.log('Student API would return:');
    studentApiResult.forEach((course, index) => {
      console.log(`${index + 1}. ${course.course_code} - ${course.course_name}`);
      console.log(`   Teacher: ${course.teacher_name}, Section: ${course.section_name}`);
    });

    // 5. Check admin API simulation
    console.log('\n👨‍💼 SIMULATING ADMIN API CALL:');
    const [adminApiResult] = await connection.execute(`
      SELECT s.id, s.name, s.email, s.role,
             GROUP_CONCAT(CONCAT(c.course_code, ' - ', c.title) SEPARATOR ', ') as enrolled_courses,
             COUNT(DISTINCT e.id) as total_enrollments
      FROM users s
      LEFT JOIN enrollments e ON s.id = e.student_id
      LEFT JOIN sections sec ON e.section_id = sec.id
      LEFT JOIN courses c ON sec.course_id = c.id
      WHERE s.id = ? AND s.role = 'student'
      GROUP BY s.id
    `, [32]);

    console.log('Admin API would return:');
    if (adminApiResult.length > 0) {
      const student = adminApiResult[0];
      console.log(`Student: ${student.name} (${student.email})`);
      console.log(`Enrolled Courses: ${student.enrolled_courses || 'None'}`);
      console.log(`Total Enrollments: ${student.total_enrollments}`);
    }

    // 6. Check for any Biology course enrollments for Mahe
    console.log('\n🧬 CHECKING FOR BIOLOGY ENROLLMENTS:');
    const [biologyCheck] = await connection.execute(`
      SELECT e.*, s.name as section_name, c.course_code, c.title
      FROM enrollments e
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE e.student_id = ? AND c.course_code = 'Bio-201'
    `, [32]);

    if (biologyCheck.length > 0) {
      console.log('✅ FOUND Biology enrollment:');
      biologyCheck.forEach(enrollment => {
        console.log(`Section: ${enrollment.section_name}, Course: ${enrollment.course_code} - ${enrollment.title}`);
        console.log(`Enrolled at: ${enrollment.enrolled_at}`);
      });
    } else {
      console.log('❌ NO Biology enrollment found in database!');
    }

    // 7. Check if there are any sections for Biology course
    console.log('\n📖 CHECKING BIOLOGY COURSE SECTIONS:');
    const [biologySections] = await connection.execute(`
      SELECT s.*, c.course_code, c.title
      FROM sections s
      JOIN courses c ON s.course_id = c.id
      WHERE c.course_code = 'Bio-201'
    `);

    if (biologySections.length > 0) {
      console.log('Biology sections available:');
      biologySections.forEach(section => {
        console.log(`Section ID: ${section.id}, Name: ${section.name}, Course: ${section.course_code} - ${section.title}`);
      });
    } else {
      console.log('❌ NO Biology sections found!');
    }

    await connection.end();
    console.log('\n🏁 Investigation complete!');

  } catch (error) {
    console.error('❌ Error during investigation:', error);
  }
}

investigateEnrollmentMismatch();