const { execSync } = require('child_process');

try {
  console.log('Testing ELMS Backend API...');
  
  // Test health endpoint
  const result = execSync('curl -s http://localhost:5000/health', { encoding: 'utf8' });
  console.log('Health Check Response:', result);
  
} catch (error) {
  console.error('Error testing API:', error.message);
}