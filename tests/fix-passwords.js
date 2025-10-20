const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'password123';
  const saltRounds = 10; // Match what your AuthService uses (though you use 12)
  
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('🔐 Generated password hash for "password123":');
  console.log(hash);
  console.log('');
  console.log('📝 SQL to update all users with correct password:');
  console.log('');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email IN (`);
  console.log(`  'sakib221131@bscse.uiu.ac.bd',`);
  console.log(`  'sarah.johnson@uiu.ac.bd',`);
  console.log(`  'admin.aminul@uiu.ac.bd'`);
  console.log(`);`);
  console.log('');
  console.log('🎯 Run this SQL in phpMyAdmin to fix the passwords!');
}

generatePasswordHash();