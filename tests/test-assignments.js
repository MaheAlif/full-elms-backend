// Test script to check assignments and submissions tables
const mysql = require('mysql2/promise');

async function testAssignments() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('🔗 Connected to database');

    // Check assignments table
    console.log('\n📋 Checking assignments table...');
    const [assignments] = await connection.execute('SELECT COUNT(*) as count FROM assignments');
    console.log(`Found ${assignments[0].count} assignments`);

    if (assignments[0].count > 0) {
      const [sampleAssignments] = await connection.execute('SELECT * FROM assignments LIMIT 3');
      console.log('Sample assignments:', sampleAssignments);
    }

    // Check submissions table structure
    console.log('\n📊 Checking submissions table structure...');
    const [submissionsStructure] = await connection.execute('DESCRIBE submissions');
    console.log('Submissions table columns:');
    submissionsStructure.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check submissions count
    const [submissions] = await connection.execute('SELECT COUNT(*) as count FROM submissions');
    console.log(`\nFound ${submissions[0].count} submissions`);

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

testAssignments();