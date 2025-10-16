const mysql = require('mysql2/promise');

async function checkDsaCourse() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('=== CHECKING DSA COURSE ===\n');
    
    // Find DSA course
    const [courses] = await conn.query(
      `SELECT * FROM courses 
       WHERE course_code LIKE '%DSA%' 
          OR course_code LIKE '%2201%' 
          OR title LIKE '%Data Structures%'
          OR title LIKE '%Dsa%'
       ORDER BY id DESC
       LIMIT 5`
    );
    
    console.log('Recent Data Structures/DSA Courses:');
    console.table(courses.map(c => ({ 
      id: c.id, 
      code: c.course_code, 
      title: c.title,
      teacher_id: c.teacher_id 
    })));

    if (courses.length > 0) {
      const courseId = courses[0].id;
      
      console.log(`\n=== SECTIONS FOR COURSE: ${courses[0].title} ===`);
      const [sections] = await conn.query(
        'SELECT * FROM sections WHERE course_id = ?', 
        [courseId]
      );
      console.table(sections);

      if (sections.length > 0) {
        const sectionId = sections[0].id;
        
        console.log('\n=== ENROLLMENTS IN THIS SECTION ===');
        const [enrollments] = await conn.query(
          `SELECT e.*, u.name as student_name, u.email 
           FROM enrollments e 
           JOIN users u ON e.user_id = u.id 
           WHERE e.section_id = ?`,
          [sectionId]
        );
        console.table(enrollments.map(e => ({
          enrollment_id: e.id,
          student_name: e.student_name,
          email: e.email,
          user_id: e.user_id
        })));
        
        console.log(`\nTotal students enrolled: ${enrollments.length}`);

        console.log('\n=== CHECKING IF MAHE (ID: 32) IS ENROLLED ===');
        const [maheEnrollment] = await conn.query(
          `SELECT e.*, s.name as section_name, c.title as course_name 
           FROM enrollments e 
           JOIN sections s ON e.section_id = s.id 
           JOIN courses c ON s.course_id = c.id 
           WHERE e.user_id = 32 AND c.id = ?`,
          [courseId]
        );

        if (maheEnrollment.length > 0) {
          console.log('✅ Mahe IS enrolled!');
          console.table(maheEnrollment);
        } else {
          console.log('❌ Mahe is NOT enrolled in this course!');
          console.log('\n💡 Solution: Enroll Mahe from the admin panel or run:');
          console.log(`   INSERT INTO enrollments (user_id, section_id) VALUES (32, ${sectionId});`);
        }
      } else {
        console.log('❌ No sections found for this course!');
        console.log('💡 Solution: Create a section from admin panel first');
      }
    } else {
      console.log('❌ No DSA course found!');
    }

    await conn.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDsaCourse();
