const mysql = require('mysql2/promise');

async function testChatAPI() {
  console.log('🧪 Testing Chat API...\n');
  
  try {
    // Get Mahe's token from the database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    // Get Mahe's user info
    const [users] = await conn.query(
      'SELECT id, name, email, role FROM users WHERE id = 32'
    );
    
    if (users.length === 0) {
      console.error('❌ User not found!');
      return;
    }

    const user = users[0];
    console.log('👤 User:', user);

    // Get Mahe's enrollments
    const [enrollments] = await conn.query(`
      SELECT e.id, e.user_id, e.section_id, 
             s.name as section_name, s.course_id,
             c.title as course_name, c.course_code
      FROM enrollments e
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE e.user_id = 32
    `);
    
    console.log('\n📚 Mahe\'s Enrollments:');
    enrollments.forEach(e => {
      console.log(`  - ${e.course_code}: ${e.course_name} (Section: ${e.section_name}, Section ID: ${e.section_id})`);
    });

    // Test the API endpoint
    const courseId = 1; // Advanced React Development
    const apiUrl = `http://localhost:5000/api/student/courses/${courseId}/chat`;
    
    console.log(`\n🌐 Testing API: ${apiUrl}`);
    
    // Create a simple JWT token for testing
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      'fallback-secret', // Must match the backend JWT_SECRET
      { expiresIn: '24h' }
    );

    console.log('🔑 Generated token:', token.substring(0, 50) + '...');

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('\n📦 Response data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SUCCESS!');
      console.log(`   Room ID: ${data.data.room.id}`);
      console.log(`   Room Name: ${data.data.room.name}`);
      console.log(`   Messages: ${data.data.messages.length}`);
      console.log(`   Participants: ${data.data.participants.length}`);
      
      if (data.data.participants.length > 0) {
        console.log('\n👥 Participants:');
        data.data.participants.forEach(p => {
          console.log(`   - ${p.name} (${p.role})`);
        });
      }
    } else {
      console.log('\n❌ FAILED:', data.message);
    }

    await conn.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause);
    }
  }
}

testChatAPI();
