const mysql = require('mysql2/promise');

async function checkSections() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elms'
  });

  try {
    console.log('Checking sections in database...\n');
    
    // Get all sections
    const [sections] = await connection.execute(`
      SELECT s.*, c.title as course_title, c.course_code 
      FROM sections s 
      LEFT JOIN courses c ON s.course_id = c.id 
      ORDER BY s.created_at DESC 
      LIMIT 10
    `);
    
    console.log(`Found ${sections.length} sections (showing last 10):\n`);
    
    sections.forEach((section, index) => {
      console.log(`${index + 1}. Section ID: ${section.id}`);
      console.log(`   Name: ${section.name}`);
      console.log(`   Course: ${section.course_code} - ${section.course_title}`);
      console.log(`   Max Capacity: ${section.max_capacity}`);
      console.log(`   Teacher ID: ${section.teacher_id || 'Not assigned'}`);
      console.log(`   Created: ${section.created_at}`);
      console.log('');
    });
    
    // Check for test sections specifically (with timestamp pattern)
    const [testSections] = await connection.execute(`
      SELECT s.*, c.title as course_title, c.course_code 
      FROM sections s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.name LIKE '%-%' AND s.name REGEXP '[0-9]{13}'
      ORDER BY s.created_at DESC 
      LIMIT 10
    `);
    
    console.log(`\nTest sections with timestamp pattern: ${testSections.length}`);
    testSections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.name}`);
      console.log(`   Course: ${section.course_code} - ${section.course_title}`);
      console.log(`   ID: ${section.id}, Created: ${section.created_at}`);
      console.log('');
    });
    
    // Check specifically for today's test sections
    const [todaySections] = await connection.execute(`
      SELECT s.*, c.title as course_title, c.course_code 
      FROM sections s
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE DATE(s.created_at) = CURDATE()
      ORDER BY s.created_at DESC
    `);
    
    console.log(`\nSections created today: ${todaySections.length}`);
    todaySections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.name} (Course: ${section.course_code}, ID: ${section.id})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkSections();
