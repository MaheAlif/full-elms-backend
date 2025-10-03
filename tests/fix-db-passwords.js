const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixDatabasePasswords() {
  console.log('🔧 Fixing database passwords...\n');
  
  // Database connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL root password
    database: 'elms'
  });
  
  try {
    // Generate correct hash for password123
    const correctHash = await bcrypt.hash('password123', 10);
    console.log('✅ Generated correct hash for password123');
    
    // Update the test users
    const [result] = await connection.execute(
      `UPDATE users SET password_hash = ? WHERE email IN (?, ?, ?)`,
      [
        correctHash,
        'sakib221131@bscse.uiu.ac.bd',
        'sarah.johnson@uiu.ac.bd', 
        'admin.aminul@uiu.ac.bd'
      ]
    );
    
    console.log(`✅ Updated ${result.affectedRows} user passwords`);
    console.log('');
    console.log('🎯 Test users now have correct password: password123');
    console.log('');
    console.log('Test again with:');
    console.log('- Email: sakib221131@bscse.uiu.ac.bd');
    console.log('- Password: password123');
    console.log('- Role: student');
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
  } finally {
    await connection.end();
  }
}

fixDatabasePasswords();