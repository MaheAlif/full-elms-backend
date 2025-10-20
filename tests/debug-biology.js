const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBiologyIssues() {
  try {
    console.log('🔍 BIOLOGY ASSIGNMENT INVESTIGATION');
    console.log('=' .repeat(50));
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Check Biology course
    console.log('\n🧬 BIOLOGY COURSE:');
    const [bioCourse] = await connection.execute(`
      SELECT * FROM courses WHERE course_code = 'Bio-201'
    `);
    console.table(bioCourse);

    // Check Biology sections
    console.log('\n📖 BIOLOGY SECTIONS:');
    const [bioSections] = await connection.execute(`
      SELECT * FROM sections WHERE course_id = 7
    `);
    if (bioSections.length > 0) {
      console.table(bioSections);
    } else {
      console.log('❌ No sections found for Biology (course_id: 7)');
    }

    // Check ALL assignments and see which belong to Biology
    console.log('\n📝 ALL ASSIGNMENTS WITH COURSE INFO:');
    const [allAssignments] = await connection.execute(`
      SELECT a.id, a.title, a.section_id, s.course_id, c.course_code, c.title as course_name
      FROM assignments a
      LEFT JOIN sections s ON a.section_id = s.id
      LEFT JOIN courses c ON s.course_id = c.id
      ORDER BY a.id
    `);
    console.table(allAssignments);

    await connection.end();

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBiologyIssues();