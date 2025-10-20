const mysql = require('mysql2/promise');

async function fixDsaCourse() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔧 Fixing DSA Course Setup...\n');

    // Get the DSA course
    const [courses] = await conn.query(
      'SELECT * FROM courses WHERE id = 9 LIMIT 1'
    );

    if (courses.length === 0) {
      console.log('❌ DSA course not found!');
      await conn.end();
      return;
    }

    const course = courses[0];
    console.log(`✅ Found course: ${course.title} (${course.course_code})`);

    // Check if section exists
    const [existingSections] = await conn.query(
      'SELECT * FROM sections WHERE course_id = ?',
      [course.id]
    );

    let sectionId;

    if (existingSections.length === 0) {
      console.log('\n📝 Creating section...');
      const [result] = await conn.query(
        'INSERT INTO sections (course_id, name) VALUES (?, ?)',
        [course.id, `${course.course_code} - Section A`]
      );
      sectionId = result.insertId;
      console.log(`✅ Section created: ${course.course_code} - Section A (ID: ${sectionId})`);
    } else {
      sectionId = existingSections[0].id;
      console.log(`✅ Section already exists: ${existingSections[0].name} (ID: ${sectionId})`);
    }

    // Check current enrollments
    const [currentEnrollments] = await conn.query(
      `SELECT e.*, u.name, u.email 
       FROM enrollments e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.section_id = ?`,
      [sectionId]
    );

    console.log(`\n📊 Current enrollments: ${currentEnrollments.length} students`);
    if (currentEnrollments.length > 0) {
      console.table(currentEnrollments.map(e => ({
        name: e.name,
        email: e.email
      })));
    }

    // Check if Mahe is enrolled
    const maheEnrolled = currentEnrollments.some(e => e.user_id === 32);

    if (!maheEnrolled) {
      console.log('\n👤 Enrolling Mahe Alif...');
      await conn.query(
        'INSERT INTO enrollments (user_id, section_id) VALUES (32, ?)',
        [sectionId]
      );
      console.log('✅ Mahe enrolled successfully!');
    } else {
      console.log('\n✅ Mahe is already enrolled');
    }

    // Final summary
    const [finalEnrollments] = await conn.query(
      `SELECT e.*, u.name, u.email 
       FROM enrollments e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.section_id = ?`,
      [sectionId]
    );

    console.log(`\n✨ Setup Complete!`);
    console.log(`   Course: ${course.title}`);
    console.log(`   Section: ${course.course_code} - Section A`);
    console.log(`   Total Students: ${finalEnrollments.length}`);
    console.log('\n👥 Enrolled Students:');
    console.table(finalEnrollments.map(e => ({
      name: e.name,
      email: e.email
    })));

    console.log('\n🔄 Next Steps:');
    console.log('   1. Refresh your browser (F5)');
    console.log('   2. Go to DSA course');
    console.log('   3. Click Class Chat tab');
    console.log(`   4. Should see ${finalEnrollments.length} members!`);

    await conn.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixDsaCourse();
