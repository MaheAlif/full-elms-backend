// Test script to check materials file paths in database
const mysql = require('mysql2/promise');

async function testMaterialsPaths() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'elms_database'
    });

    console.log('🔗 Connected to database');

    // Query materials to see their file paths
    const [materials] = await connection.execute(`
      SELECT id, title, file_path, type 
      FROM materials 
      LIMIT 5
    `);

    console.log('📁 Materials file paths:');
    materials.forEach(material => {
      console.log(`- ID: ${material.id}`);
      console.log(`  Title: ${material.title}`);
      console.log(`  File Path: ${material.file_path}`);
      console.log(`  Type: ${material.type}`);
      console.log('');
    });

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

testMaterialsPaths();