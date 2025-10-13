const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCourseData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms'
    });

    console.log('🔍 Checking course data structure...');
    
    // Check what courses Mahe is enrolled in
    const [courses] = await connection.execute(`
      SELECT 
        c.id,
        c.title,
        c.course_code,
        c.description,
        s.id as section_id,
        s.name as section_name,
        COUNT(m.id) as material_count
      FROM enrollments e
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN materials m ON s.id = m.section_id
      WHERE e.user_id = 32
      GROUP BY c.id, s.id
    `);
    
    console.log('📚 Mahe\'s enrolled courses:');
    courses.forEach(course => {
      console.log(`  Course ID: ${course.id}`);
      console.log(`  Title: ${course.title}`);
      console.log(`  Course Code: ${course.course_code}`);
      console.log(`  Section: ${course.section_name} (ID: ${course.section_id})`);
      console.log(`  Materials: ${course.material_count}`);
      console.log('  ---');
    });

    // Now test the exact query from the studentController
    console.log('🧪 Testing the exact materials query...');
    const [materials] = await connection.execute(`
      SELECT 
        m.id,
        m.title,
        m.type,
        m.file_path,
        m.size,
        m.upload_date,
        c.title as course_name,
        c.course_code,
        c.id as course_id,
        u.name as uploaded_by
      FROM materials m
      JOIN sections s ON m.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE e.user_id = ?
      ORDER BY m.upload_date DESC
    `, [32]);

    console.log(`📁 Found ${materials.length} materials:`);
    materials.forEach(material => {
      console.log(`  - ${material.title} (${material.type})`);
      console.log(`    Course: ${material.course_code} - ${material.course_name}`);
      console.log(`    Size: ${material.size}`);
      console.log(`    Date: ${material.upload_date}`);
      console.log('    ---');
    });

    await connection.end();
    console.log('🎉 Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCourseData();