const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testSpecificUsers() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔍 Testing specific users mentioned by user...\n');

    // Users to test
    const usersToTest = [
      { name: 'Fatima Aktar', possibleEmails: ['fatima.aktar@uiu.ac.bd', 'fatima.rahman@uiu.ac.bd'] },
      { name: 'Mahe Alif', possibleEmails: ['mahe.alif@uiu.ac.bd', 'a.m.shahriar.rashid.mahe@bscse.uiu.ac.bd'] }
    ];

    for (const user of usersToTest) {
      console.log(`🔍 Searching for ${user.name}...`);
      
      // Try exact name match
      const [exactNameResults] = await connection.execute(
        'SELECT name, email, role FROM users WHERE name LIKE ?',
        [`%${user.name}%`]
      );

      if (exactNameResults.length > 0) {
        console.log(`✅ Found exact name matches for ${user.name}:`);
        exactNameResults.forEach(result => {
          console.log(`  - ${result.name} (${result.email}) - ${result.role}`);
        });
      }

      // Try email matches
      for (const email of user.possibleEmails) {
        const [emailResults] = await connection.execute(
          'SELECT name, email, role FROM users WHERE email = ?',
          [email]
        );

        if (emailResults.length > 0) {
          console.log(`✅ Found email match for ${email}:`);
          emailResults.forEach(result => {
            console.log(`  - ${result.name} (${result.email}) - ${result.role}`);
          });
        }
      }

      console.log(''); // Empty line for spacing
    }

    // Also check for Fatima Rahman (found in teachers list)
    console.log('🔍 Checking Dr. Fatima Rahman (found in teachers list)...');
    const [fatimaResults] = await connection.execute(
      'SELECT name, email, role, password_hash FROM users WHERE email = ?',
      ['fatima.rahman@uiu.ac.bd']
    );

    if (fatimaResults.length > 0) {
      const fatima = fatimaResults[0];
      console.log(`✅ Found: ${fatima.name} (${fatima.email}) - ${fatima.role}`);
      
      // Test password
      const testPassword = 'password123';
      const isValidPassword = await bcrypt.compare(testPassword, fatima.password_hash);
      console.log(`🔐 Password "password123" valid: ${isValidPassword ? '✅ YES' : '❌ NO'}`);
    }

    // Check students that might match
    console.log('\n🔍 Searching for students with similar names...');
    const [studentResults] = await connection.execute(
      'SELECT name, email, role FROM users WHERE role = "student" AND (name LIKE "%Mahe%" OR name LIKE "%Fatima%" OR name LIKE "%Alif%" OR name LIKE "%Shahriar%")'
    );

    if (studentResults.length > 0) {
      console.log('✅ Found potential matches:');
      studentResults.forEach(result => {
        console.log(`  - ${result.name} (${result.email}) - ${result.role}`);
      });
    } else {
      console.log('❌ No students found with similar names');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testSpecificUsers();