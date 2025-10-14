const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkEnrollmentsTableStructure() {
  try {
    console.log('🔍 CHECKING ENROLLMENTS TABLE STRUCTURE');
    console.log('=' .repeat(50));
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // 1. Describe the enrollments table structure
    console.log('\n📋 ENROLLMENTS TABLE STRUCTURE:');
    const [tableStructure] = await connection.execute('DESCRIBE enrollments');
    console.table(tableStructure);

    // 2. Show sample data from enrollments table
    console.log('\n📊 SAMPLE ENROLLMENTS DATA (first 10 rows):');
    const [sampleData] = await connection.execute('SELECT * FROM enrollments LIMIT 10');
    console.table(sampleData);

    // 3. Count total enrollments
    console.log('\n📈 ENROLLMENT STATISTICS:');
    const [totalCount] = await connection.execute('SELECT COUNT(*) as total_enrollments FROM enrollments');
    console.log(`Total enrollments: ${totalCount[0].total_enrollments}`);

    // 4. Check for any records with user_id = 32 (Mahe Alif's ID)
    console.log('\n🎯 CHECKING FOR MAHE ALIF (ID: 32) IN ENROLLMENTS:');
    try {
      // Try different possible column names
      const possibleColumns = ['student_id', 'user_id', 'id'];
      
      for (const column of possibleColumns) {
        try {
          const [results] = await connection.execute(`SELECT * FROM enrollments WHERE ${column} = 32`);
          console.log(`✅ Found ${results.length} records using column '${column}':`, results);
        } catch (error) {
          console.log(`❌ Column '${column}' doesn't exist`);
        }
      }
    } catch (error) {
      console.log('Error checking enrollments:', error.message);
    }

    await connection.end();
    console.log('\n🏁 Table structure check complete!');

  } catch (error) {
    console.error('❌ Error during table structure check:', error);
  }
}

checkEnrollmentsTableStructure();