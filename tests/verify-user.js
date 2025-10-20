const axios = require('axios');

async function verifyTestUser() {
  try {
    console.log('🔍 Checking if Test User exists in database...\n');
    
    // First, let's try to login with the test user
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@student.uiu.ac.bd',
      password: 'password123',
      role: 'student'
    });
    
    if (loginResponse.data.success) {
      const user = loginResponse.data.data.user;
      console.log('✅ Test User FOUND in database!');
      console.log('📋 User Details:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Avatar: ${user.avatar_url || 'None'}`);
      console.log('');
      
      // Let's also register another user to see if it gets added
      console.log('🧪 Testing registration with a new user...');
      
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Debug User',
        email: 'debug@student.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      });
      
      if (registerResponse.data.success) {
        const newUser = registerResponse.data.data.user;
        console.log('✅ New user created successfully!');
        console.log(`   New User ID: ${newUser.id}`);
        console.log(`   Name: ${newUser.name}`);
        console.log(`   Email: ${newUser.email}`);
        console.log('');
        console.log('💡 Check your database for users with IDs:', user.id, 'and', newUser.id);
      }
      
    } else {
      console.log('❌ Test User NOT found - it might not exist yet');
    }
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Test User NOT found - invalid credentials');
    } else if (error.response?.status === 409) {
      console.log('ℹ️ User already exists - this confirms the Test User is in the database!');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

verifyTestUser();