// Simple test to check if server is accessible
const http = require('http');

console.log('Testing server connectivity...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('✅ Server is reachable!');
  console.log('Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    // If health check works, test admin login
    testAdminLogin();
  });
});

req.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

req.setTimeout(5000, () => {
  console.error('❌ Connection timeout');
  req.destroy();
});

function testAdminLogin() {
  console.log('\n🔐 Testing admin login...');
  
  const loginData = JSON.stringify({
    email: 'admin.aminul@uiu.ac.bd',
    password: 'password123',
    role: 'admin'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    console.log('Login Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Login Response:', data);
      
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        if (response.success && response.data.token) {
          console.log('✅ Admin login successful!');
          testAdminStats(response.data.token);
        } else {
          console.log('❌ Login failed:', response);
        }
      } else {
        console.log('❌ Login request failed with status:', res.statusCode);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Login request error:', err.message);
  });

  req.write(loginData);
  req.end();
}

function testAdminStats(token) {
  console.log('\n📊 Testing admin stats endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log('Stats Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Stats Response:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Admin stats endpoint working!');
      } else {
        console.log('❌ Admin stats failed with status:', res.statusCode);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Stats request error:', err.message);
  });

  req.end();
}

req.end();