const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elms'
};

async function testSubmissionQuery() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    const studentId = 32; // Mahe's ID
    const assignmentId = 14; // Biology A-1 Lab assignment

    console.log('\n=== Testing Assignment Verification Query ===');
    console.log('Student ID:', studentId);
    console.log('Assignment ID:', assignmentId);

    const [assignment] = await connection.query(`
      SELECT 
        a.id,
        a.due_date,
        a.title as assignment_title,
        c.title as course_name
      FROM assignments a
      JOIN sections s ON a.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      JOIN enrollments e ON (s.id = e.section_id OR c.id = e.course_id)
      WHERE a.id = ? AND e.user_id = ?
    `, [assignmentId, studentId]);

    console.log('\nQuery result:', assignment);

    if (assignment.length === 0) {
      console.log('❌ No assignment found - this would cause 404 error');
    } else {
      console.log('✅ Assignment found - submission should work');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testSubmissionQuery();