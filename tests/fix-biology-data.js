const mysql = require('mysql2/promise');
require('dotenv').config();

async function createBiologySectionAndFixData() {
  try {
    console.log('🔧 CREATING BIOLOGY SECTION AND FIXING DATA');
    console.log('=' .repeat(60));
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // 1. Create a Biology section
    console.log('📖 Creating Biology section...');
    const [sectionResult] = await connection.execute(`
      INSERT INTO sections (course_id, name, created_at)
      VALUES (7, 'Bio-201 - Section A', NOW())
    `);
    const biologySectionId = sectionResult.insertId;
    console.log(`✅ Created Biology section with ID: ${biologySectionId}`);

    // 2. Create a proper Biology assignment
    console.log('📝 Creating Biology assignment...');
    await connection.execute(`
      INSERT INTO assignments (section_id, title, description, due_date, total_marks, created_at)
      VALUES (?, 'Biology Lab Report', 'Write a comprehensive lab report on plant cell structure and function.', '2025-10-25 23:59:00', 100, NOW())
    `, [biologySectionId]);
    console.log('✅ Created Biology assignment');

    // 3. Enroll Mahe in the Biology section (remove direct course enrollment)
    console.log('🎓 Updating Mahe\'s Biology enrollment...');
    
    // First, delete the direct course enrollment
    await connection.execute(`
      DELETE FROM enrollments WHERE user_id = 32 AND course_id = 7
    `);
    console.log('✅ Removed direct course enrollment');

    // Add section enrollment
    await connection.execute(`
      INSERT INTO enrollments (user_id, section_id, enrolled_at)
      VALUES (32, ?, NOW())
    `, [biologySectionId]);
    console.log('✅ Added section enrollment for Biology');

    // 4. Fix the misplaced "Biology A-1" assignment
    console.log('🔧 Moving Biology A-1 assignment to Biology section...');
    await connection.execute(`
      UPDATE assignments 
      SET section_id = ?, title = 'Biology A-1 Lab'
      WHERE id = 14 AND title = 'Biology A-1'
    `, [biologySectionId]);
    console.log('✅ Moved Biology A-1 to Biology section');

    // 5. Create calendar event for Biology assignment
    console.log('📅 Creating calendar event...');
    await connection.execute(`
      INSERT INTO calendar_events (section_id, title, description, date, type, created_at)
      VALUES (?, 'Assignment Due: Biology A-1 Lab', 'Biology lab report assignment deadline', '2025-10-27', 'assignment', NOW())
    `, [biologySectionId]);
    console.log('✅ Created calendar event');

    // 6. Verify the changes
    console.log('\n🔍 VERIFICATION:');
    
    const [updatedEnrollments] = await connection.execute(`
      SELECT e.*, s.name as section_name, c.course_code, c.title as course_name
      FROM enrollments e
      LEFT JOIN sections s ON e.section_id = s.id
      LEFT JOIN courses c ON (s.course_id = c.id OR e.course_id = c.id)
      WHERE e.user_id = 32
      ORDER BY e.enrolled_at DESC
    `);
    console.log('Mahe\'s updated enrollments:');
    console.table(updatedEnrollments);

    const [biologyAssignments] = await connection.execute(`
      SELECT a.*, s.name as section_name, c.course_code
      FROM assignments a
      JOIN sections s ON a.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE c.course_code = 'Bio-201'
    `);
    console.log('Biology assignments:');
    console.table(biologyAssignments);

    await connection.end();
    console.log('\n🎉 Biology data fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing Biology data:', error);
  }
}

createBiologySectionAndFixData();