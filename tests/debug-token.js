// This script helps debug the JWT token issue
const jwt = require('jsonwebtoken');

// Try different secrets
const secrets = [
  'fallback-secret',
  'your-secret-key-change-this-in-production',
  'elms-secret-key'
];

const payload = {
  userId: 32,
  email: 'mahe221130@bscse.uiu.ac.bd',
  role: 'student'
};

console.log('🔐 Testing different JWT secrets...\n');

secrets.forEach((secret, index) => {
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  console.log(`${index + 1}. Secret: "${secret}"`);
  console.log(`   Token: ${token.substring(0, 50)}...`);
  
  try {
    const decoded = jwt.verify(token, secret);
    console.log(`   ✅ Verification successful`);
    console.log(`   Decoded:`, decoded);
  } catch (error) {
    console.log(`   ❌ Verification failed:`, error.message);
  }
  console.log();
});

// Also check if there's a token in localStorage (simulated)
console.log('\n📝 To get the actual token from browser:');
console.log('   1. Open browser console (F12)');
console.log('   2. Run: localStorage.getItem("token")');
console.log('   3. Copy the token and decode it at jwt.io');
