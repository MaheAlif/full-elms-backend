const { getPool } = require('../src/utils/database');

(async () => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT id, course_id, name, max_capacity, current_enrollment, created_at FROM sections ORDER BY created_at DESC LIMIT 10');
    console.log('Recent sections:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error querying sections:', err);
    process.exit(1);
  }
})();