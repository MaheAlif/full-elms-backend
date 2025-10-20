const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCourseCodes() {
  try {
    console.log('🔗 Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Database connected successfully');
    
    // Update course codes for all courses
    const courseUpdates = [
      { id: 1, code: 'CSE-4101', title: 'Advanced React Development' },
      { id: 2, code: 'CSE-4201', title: 'Machine Learning Fundamentals' },
      { id: 3, code: 'CSE-3301', title: 'Database Design & SQL' },
      { id: 4, code: 'CSE-4401', title: 'Web Security & Cryptography' },
      { id: 5, code: 'CSE-2501', title: 'Data Structures & Algorithms' },
      { id: 6, code: 'CSE-3601', title: 'Software Engineering Principles' },
      { id: 7, code: 'Bio-201', title: 'Biology' },
      { id: 8, code: 'Psy-231', title: 'Psychology' }
    ];

    console.log('📝 Updating course codes...');
    
    for (const course of courseUpdates) {
      await connection.execute(
        'UPDATE courses SET course_code = ? WHERE id = ?',
        [course.code, course.id]
      );
      console.log(`✅ Updated Course ${course.id}: ${course.code} - ${course.title}`);
    }

    // Verify the updates
    console.log('\n🔍 Verifying course codes after update:');
    const [courses] = await connection.execute(`
      SELECT id, course_code, title, teacher_id
      FROM courses
      ORDER BY id
    `);

    courses.forEach(course => {
      console.log(`ID: ${course.id} | Code: ${course.course_code || 'NULL'} | Title: ${course.title}`);
    });

    await connection.end();
    console.log('\n🎉 Course codes updated successfully!');

  } catch (error) {
    console.error('❌ Error fixing course codes:', error);
  }
}

fixCourseCodes();