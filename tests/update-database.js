const mysql = require('mysql2/promise');
const fs = require('fs');

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', 
      password: '',
      database: 'elms',
      multipleStatements: true
    });

    console.log('🔗 Connected to database');
    
    const sql = fs.readFileSync('../add_university_events_table.sql', 'utf8');
    await connection.execute(sql);
    
    console.log('✅ University events table created successfully');
    console.log('✅ Sample university events inserted');
    
    // Check if table was created
    const [tables] = await connection.execute('SHOW TABLES LIKE "university_events"');
    console.log('📊 University events table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      const [events] = await connection.execute('SELECT COUNT(*) as count FROM university_events');
      console.log(`📅 University events count: ${events[0].count}`);
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database update failed:', error.message);
  }
}

updateDatabase();