const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMaheAlif() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms'
    });

    // Check if Mahe Alif exists
    console.log('🔍 Looking for Mahe Alif...');
    const [users] = await connection.execute(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      ['mahe221130@bscse.uiu.ac.bd']
    );

    if (users.length === 0) {
      console.log('❌ Mahe Alif not found in database');
      console.log('📝 Creating Mahe Alif user...');
      
      const [result] = await connection.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        ['Mahe Alif', 'mahe221130@bscse.uiu.ac.bd', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student']
      );
      
      const userId = result.insertId;
      console.log(`✅ Created Mahe Alif with ID: ${userId}`);
      
      // Add enrollments to sections with materials
      console.log('📚 Adding course enrollments...');
      await connection.execute(
        "INSERT INTO enrollments (user_id, section_id) VALUES (?, ?), (?, ?)",
        [userId, 1, userId, 3] // Section 1 (React) and Section 3 (ML)
      );
      
      console.log('✅ Added enrollments to React and ML courses');
      
    } else {
      const user = users[0];
      console.log(`✅ Found Mahe Alif: ID ${user.id}, Role: ${user.role}`);
      
      // Check enrollments
      const [enrollments] = await connection.execute(`
        SELECT 
          e.id, 
          s.name as section_name, 
          c.title as course_name, 
          c.course_code,
          COUNT(m.id) as material_count
        FROM enrollments e 
        JOIN sections s ON e.section_id = s.id 
        JOIN courses c ON s.course_id = c.id 
        LEFT JOIN materials m ON s.id = m.section_id
        WHERE e.user_id = ?
        GROUP BY e.id, s.name, c.title, c.course_code
      `, [user.id]);
      
      console.log('📚 Current enrollments:');
      enrollments.forEach(enrollment => {
        console.log(`  - ${enrollment.course_code}: ${enrollment.course_name} (${enrollment.material_count} materials)`);
      });
      
      // If no enrollments with materials, add some
      const enrollmentsWithMaterials = enrollments.filter(e => e.material_count > 0);
      if (enrollmentsWithMaterials.length === 0) {
        console.log('📝 Adding enrollments with materials...');
        await connection.execute(
          "INSERT IGNORE INTO enrollments (user_id, section_id) VALUES (?, ?), (?, ?)",
          [user.id, 1, user.id, 3]
        );
        console.log('✅ Added enrollments to sections with materials');
      }
    }

    await connection.end();
    console.log('🎉 Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMaheAlif();