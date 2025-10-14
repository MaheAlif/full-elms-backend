const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAllTableStructures() {
  try {
    console.log('🔍 CHECKING ALL RELEVANT TABLE STRUCTURES');
    console.log('=' .repeat(60));
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const tables = ['enrollments', 'materials', 'assignments', 'calendar_events'];
    
    for (const table of tables) {
      console.log(`\n📋 ${table.toUpperCase()} TABLE STRUCTURE:`);
      try {
        const [structure] = await connection.execute(`DESCRIBE ${table}`);
        console.table(structure);
      } catch (error) {
        console.log(`❌ Error describing ${table}:`, error.message);
      }
    }

    await connection.end();
    console.log('\n🏁 Table structure check complete!');

  } catch (error) {
    console.error('❌ Error during table structure check:', error);
  }
}

checkAllTableStructures();