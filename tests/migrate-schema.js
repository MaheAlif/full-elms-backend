const mysql = require('mysql2/promise');

async function migrateSchema() {
  console.log('🔧 Starting Database Schema Migration...\n');
  
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms',
      multipleStatements: true
    });

    // 1. Add teacher_id to sections
    console.log('1️⃣ Adding teacher_id column to sections...');
    try {
      await conn.query(`
        ALTER TABLE sections 
        ADD COLUMN teacher_id BIGINT(20) NULL 
        COMMENT 'Teacher assigned to this section' 
        AFTER course_id
      `);
      console.log('   ✅ teacher_id added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️  teacher_id already exists');
      } else throw err;
    }

    // Add foreign key
    try {
      await conn.query(`
        ALTER TABLE sections 
        ADD CONSTRAINT fk_sections_teacher 
        FOREIGN KEY (teacher_id) REFERENCES users(id) 
        ON DELETE SET NULL
      `);
      console.log('   ✅ Foreign key constraint added');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('   ℹ️  Foreign key already exists');
      } else throw err;
    }

    // Add index
    try {
      await conn.query(`ALTER TABLE sections ADD INDEX idx_teacher_id (teacher_id)`);
      console.log('   ✅ Index added');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('   ℹ️  Index already exists');
      } else throw err;
    }

    // 2. Add capacity management
    console.log('\n2️⃣ Adding capacity management columns...');
    try {
      await conn.query(`
        ALTER TABLE sections 
        ADD COLUMN max_capacity INT DEFAULT 50 
        COMMENT 'Maximum students allowed in this section'
        AFTER name
      `);
      console.log('   ✅ max_capacity added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️  max_capacity already exists');
      } else throw err;
    }

    try {
      await conn.query(`
        ALTER TABLE sections 
        ADD COLUMN current_enrollment INT DEFAULT 0 
        COMMENT 'Current number of enrolled students'
        AFTER max_capacity
      `);
      console.log('   ✅ current_enrollment added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️  current_enrollment already exists');
      } else throw err;
    }

    // 3. Add timestamps
    console.log('\n3️⃣ Adding timestamp columns...');
    try {
      await conn.query(`
        ALTER TABLE sections 
        ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('   ✅ created_at added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️  created_at already exists');
      } else throw err;
    }

    // 4. Add enrollment index
    console.log('\n4️⃣ Adding enrollment indexes...');
    try {
      await conn.query(`
        ALTER TABLE enrollments 
        ADD INDEX idx_section_user (section_id, user_id)
      `);
      console.log('   ✅ Index added');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('   ℹ️  Index already exists');
      } else throw err;
    }

    // 5. Show updated structure
    console.log('\n📊 Updated Sections Table Structure:');
    const [sectionsCols] = await conn.query('DESCRIBE sections');
    console.table(sectionsCols.map(c => ({ 
      Field: c.Field, 
      Type: c.Type, 
      Null: c.Null, 
      Key: c.Key,
      Default: c.Default
    })));

    console.log('\n✨ Schema migration completed successfully!');
    console.log('\n📝 Next step: Run data migration script');

    await conn.end();

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateSchema();
