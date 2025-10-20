const mysql = require('mysql2/promise');

async function fixChatMessagesTable() {
  console.log('🔧 Fixing chat_messages table...\n');
  
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    console.log('📊 Current table structure:');
    const [currentColumns] = await conn.query('DESCRIBE chat_messages');
    console.table(currentColumns.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key })));

    // Check if columns already exist
    const hasMessageType = currentColumns.some(c => c.Field === 'message_type');
    const hasFileUrl = currentColumns.some(c => c.Field === 'file_url');

    if (hasMessageType && hasFileUrl) {
      console.log('\n✅ Table already has all required columns!');
      await conn.end();
      return;
    }

    console.log('\n🔨 Adding missing columns...');

    if (!hasMessageType) {
      console.log('  Adding message_type column...');
      await conn.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN message_type ENUM('text', 'image', 'file') NOT NULL DEFAULT 'text' 
        AFTER message
      `);
      console.log('  ✅ message_type added');
    }

    if (!hasFileUrl) {
      console.log('  Adding file_url column...');
      await conn.query(`
        ALTER TABLE chat_messages 
        ADD COLUMN file_url VARCHAR(500) NULL 
        AFTER message_type
      `);
      console.log('  ✅ file_url added');
    }

    console.log('\n📊 Updated table structure:');
    const [updatedColumns] = await conn.query('DESCRIBE chat_messages');
    console.table(updatedColumns.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key })));

    console.log('\n✨ Chat messages table fixed successfully!');
    console.log('\n🔄 Next steps:');
    console.log('   1. The backend server should now work without errors');
    console.log('   2. Refresh your browser (F5)');
    console.log('   3. Try the chat again');

    await conn.end();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('   Column already exists - this is fine!');
    }
  }
}

fixChatMessagesTable();
