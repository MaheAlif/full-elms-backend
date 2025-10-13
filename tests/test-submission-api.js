// Test assignment submission API
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testSubmissionAPI() {
  try {
    console.log('🔍 Testing assignment submission API...\n');
    
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'mahe221130@bscse.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      }),
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.success || !loginData.data.token) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    console.log('✅ Login successful');
    const token = loginData.data.token;
    
    // Test submission endpoint
    console.log('\n2. Testing submission endpoint...');
    
    // Create a simple test file
    const testContent = 'This is a test submission file for assignment testing.';
    fs.writeFileSync('test-submission.txt', testContent);
    
    const formData = new FormData();
    formData.append('title', 'Test Submission');
    formData.append('submission', fs.createReadStream('test-submission.txt'));
    
    const submissionResponse = await fetch('http://localhost:5000/api/student/assignments/1/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const submissionData = await submissionResponse.json();
    console.log('📤 Submission response:', JSON.stringify(submissionData, null, 2));
    
    // Clean up test file
    fs.unlinkSync('test-submission.txt');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSubmissionAPI();