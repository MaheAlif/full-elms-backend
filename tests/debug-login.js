const axios = require('axios');

async function debugLogin() {
  console.log('🔍 Debugging Login Issue...\n');
  
  try {
    // Test with the exact same data as frontend
    const loginData = {
      email: 'sakib221131@bscse.uiu.ac.bd',
      password: 'password123',
      role: 'student'
    };
    
    console.log('📤 Sending login request with:');
    console.log(JSON.stringify(loginData, null, 2));
    console.log('');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    console.log('');
    
    if (error.response?.status === 401) {
      console.log('🔍 This means either:');
      console.log('  1. Email not found in database');
      console.log('  2. Password does not match the hash in database');
      console.log('  3. AuthService.authenticateUser() is failing');
    } else if (error.response?.status === 403) {
      console.log('🔍 This means role mismatch:');
      console.log('  - User exists but role in DB != role in request');
    }
    
    console.log('\n💡 Let\'s check what\'s in the database...');
    
    // Let's try to register a new user with a known password
    try {
      console.log('\n🧪 Testing registration with known credentials...');
      const registerData = {
        name: 'Debug User',
        email: 'debug-test@student.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      };
      
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', registerData);
      console.log('✅ Registration successful:', registerResponse.data);
      
      // Now try to login with the new user
      console.log('\n🔐 Now trying to login with newly registered user...');
      const newLoginData = {
        email: 'debug-test@student.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      };
      
      const newLoginResponse = await axios.post('http://localhost:5000/api/auth/login', newLoginData);
      console.log('✅ New user login successful!');
      console.log('This means the issue is with the existing test data passwords.');
      
    } catch (regError) {
      console.log('❌ Registration/Login test failed:', regError.response?.data || regError.message);
    }
  }
}

debugLogin();