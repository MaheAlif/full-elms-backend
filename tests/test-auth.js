const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthentication() {
  console.log('🧪 Testing Authentication System\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Register a new user
    console.log('2️⃣ Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@student.uiu.ac.bd',
      password: 'password123',
      role: 'student'
    };
    
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
      console.log('');
    } catch (registerError) {
      if (registerError.response?.status === 409) {
        console.log('ℹ️ User already exists, proceeding with login test...');
      } else {
        console.log('❌ Registration error:', registerError.response?.data || registerError.message);
      }
      console.log('');
    }

    // Test 3: Login with the user
    console.log('3️⃣ Testing user login...');
    const loginData = {
      email: 'test@student.uiu.ac.bd',
      password: 'password123',
      role: 'student'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);
    
    const token = loginResponse.data.data.token;
    console.log('🎟️ Token received:', token.substring(0, 20) + '...');
    console.log('');

    // Test 4: Test session validation
    console.log('4️⃣ Testing session validation...');
    const sessionResponse = await axios.get(`${BASE_URL}/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Session validation:', sessionResponse.data);
    console.log('');

    // Test 5: Test logout
    console.log('5️⃣ Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful:', logoutResponse.data);
    console.log('');

    console.log('🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testAuthentication();