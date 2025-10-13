const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔍 Checking users in database...\n');

    // Check all teachers
    const [teachers] = await connection.execute(
      'SELECT name, email, role FROM users WHERE role = "teacher"'
    );

    console.log('👨‍🏫 Teachers in database:');
    teachers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    // Check specific user
    console.log('\n🔍 Checking Emily Rodriguez specifically...');
    const [emily] = await connection.execute(
      'SELECT * FROM users WHERE email = "emily.rodriguez@uiu.ac.bd"'
    );

    if (emily.length > 0) {
      console.log('✅ Emily Rodriguez found:', {
        name: emily[0].name,
        email: emily[0].email,
        role: emily[0].role,
        hasPassword: emily[0].password_hash ? 'Yes' : 'No'
      });
    } else {
      console.log('❌ Emily Rodriguez NOT found in database');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkUsers();