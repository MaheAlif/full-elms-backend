const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔍 Testing Emily Rodriguez login...\n');

    // Get Emily's user data
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = "emily.rodriguez@uiu.ac.bd"'
    );

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log('✅ User found:', {
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Test password comparison
    const testPassword = 'password123';
    console.log(`\n🔐 Testing password: "${testPassword}"`);
    console.log(`📋 Stored hash: ${user.password_hash}`);

    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`🔍 Password comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

    // Test with the exact hash from fake data
    const expectedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    console.log(`\n🧪 Testing with expected hash: ${expectedHash}`);
    
    const isExpectedValid = await bcrypt.compare(testPassword, expectedHash);
    console.log(`🔍 Expected hash comparison: ${isExpectedValid ? '✅ VALID' : '❌ INVALID'}`);

    // Compare the hashes
    console.log(`\n📊 Hash comparison:`);
    console.log(`  Database: ${user.password_hash}`);
    console.log(`  Expected: ${expectedHash}`);
    console.log(`  Match: ${user.password_hash === expectedHash ? '✅ YES' : '❌ NO'}`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();