const fetch = require('node-fetch');

async function testMaterialsAPI() {
  try {
    // You'll need to get a fresh token by logging in through the frontend
    // For now, let's just test without auth to see the error
    console.log('🧪 Testing student materials API...');
    
    const response = await fetch('http://localhost:5000/api/student/materials', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMaterialsAPI();