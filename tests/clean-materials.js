const mysql = require('mysql2/promise');

async function cleanFakeData() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root', 
      password: '',
      database: 'elms'
    });

    console.log('Connected to database');
    
    // Delete fake materials (IDs 1-18, keep only real uploads from ID 19+)
    const [result] = await db.execute('DELETE FROM materials WHERE id < 19');
    console.log(`Deleted ${result.affectedRows} fake material records`);
    
    // Show remaining materials
    const [materials] = await db.execute('SELECT id, title, type, file_path, upload_date FROM materials ORDER BY id');
    console.log('Remaining materials:');
    console.table(materials);
    
    await db.end();
    console.log('Database cleanup completed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanFakeData();