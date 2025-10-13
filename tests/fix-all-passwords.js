const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAllPasswords() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔐 Fixing ALL user passwords...\n');
    
    // Generate the correct hash
    const correctHash = await bcrypt.hash('password123', 10);
    console.log('✅ Generated correct hash for "password123"');
    
    // Update ALL users
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ?',
      [correctHash]
    );
    
    console.log(`🔄 Updated ${result.affectedRows} user passwords\n`);
    
    // Test Emily Rodriguez
    console.log('🧪 Testing Emily Rodriguez...');
    const [emily] = await connection.execute(
      'SELECT * FROM users WHERE email = "emily.rodriguez@uiu.ac.bd"'
    );
    
    if (emily.length > 0) {
      const isValid = await bcrypt.compare('password123', emily[0].password_hash);
      console.log(`  Emily Rodriguez: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
    await connection.end();
    console.log('\n🎉 All users can now login with password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAllPasswords();