const mysql = require('mysql2/promise');

async function checkTeacherData() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔍 Checking Dr. Sarah Johnson\'s course data...\n');
    
    // Find Sarah's user ID
    const [sarah] = await connection.execute(
      'SELECT * FROM users WHERE email = "sarah.johnson@uiu.ac.bd"'
    );
    
    if (sarah.length === 0) {
      console.log('❌ Sarah not found');
      return;
    }
    
    const teacherId = sarah[0].id;
    console.log('✅ Sarah Johnson found, ID:', teacherId);
    
    // Find her courses
    const [courses] = await connection.execute(
      'SELECT * FROM courses WHERE teacher_id = ?',
      [teacherId]
    );
    
    console.log(`\n📚 Sarah's courses (${courses.length}):`);
    courses.forEach(course => {
      console.log(`  - ${course.title} (ID: ${course.id})`);
    });
    
    if (courses.length > 0) {
      const courseId = courses[0].id;
      
      // Check sections for this course
      const [sections] = await connection.execute(
        'SELECT * FROM sections WHERE course_id = ?',
        [courseId]
      );
      
      console.log(`\n📁 Sections for "${courses[0].title}" (${sections.length}):`);
      sections.forEach(section => {
        console.log(`  - ${section.name} (ID: ${section.id})`);
      });
      
      // Check materials
      if (sections.length > 0) {
        for (const section of sections) {
          const [materials] = await connection.execute(
            'SELECT * FROM materials WHERE section_id = ?',
            [section.id]
          );
          
          console.log(`\n📄 Materials in "${section.name}" (${materials.length}):`);
          materials.forEach(material => {
            console.log(`  - ${material.title} (${material.type}) - ${material.upload_date}`);
          });
        }
      } else {
        console.log('\n⚠️  No sections found! Materials need sections to be uploaded to.');
        console.log('💡 We need to create sections for Sarah\'s course.');
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTeacherData();