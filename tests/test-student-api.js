const fetch = require('node-fetch');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testStudentAPI() {
  try {
    console.log('🧪 Testing Student API endpoints...');
    
    // First, get a valid user and create a test token
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms'
    });

    // Test 1: Login to get a token
    console.log('🔐 Step 1: Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'mahe221130@bscse.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.log('❌ Login failed, stopping test');
      return;
    }
    
    const token = loginData.data.token;
    console.log('✅ Login successful, got token');
    
    // Test 2: Get student courses
    console.log('📚 Step 2: Testing student courses...');
    const coursesResponse = await fetch('http://localhost:5000/api/student/courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const coursesData = await coursesResponse.json();
    console.log('Courses response status:', coursesResponse.status);
    console.log('Courses response:', JSON.stringify(coursesData, null, 2));
    
    // Test 3: Get student materials
    console.log('📁 Step 3: Testing student materials...');
    const materialsResponse = await fetch('http://localhost:5000/api/student/materials', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const materialsData = await materialsResponse.json();
    console.log('Materials response status:', materialsResponse.status);
    console.log('Materials response:', JSON.stringify(materialsData, null, 2));
    
    await connection.end();
    console.log('🎉 Test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testStudentAPI();