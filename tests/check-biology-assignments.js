const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elms'
};

async function checkBiologyAssignments() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Check Biology sections
    console.log('\n=== Biology Sections ===');
    const [sections] = await connection.query(`
      SELECT s.*, c.title as course_name, c.course_code 
      FROM sections s 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.title LIKE '%Biology%'
    `);
    console.log('Biology sections:', sections);

    // Check Biology assignments
    console.log('\n=== Biology Assignments ===');
    const [assignments] = await connection.query(`
      SELECT a.*, s.name as section_name, c.title as course_name 
      FROM assignments a 
      JOIN sections s ON a.section_id = s.id 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.title LIKE '%Biology%'
    `);
    console.log('Biology assignments:', assignments);

    // Check Mahe's Biology enrollment
    console.log('\n=== Mahe\'s Biology Enrollment ===');
    const [enrollment] = await connection.query(`
      SELECT e.*, u.name, c.title as course_name, s.name as section_name
      FROM enrollments e 
      JOIN users u ON e.user_id = u.id 
      LEFT JOIN courses c ON e.course_id = c.id 
      LEFT JOIN sections s ON e.section_id = s.id 
      WHERE u.name LIKE '%Mahe%' AND (c.title LIKE '%Biology%' OR s.id IN (
        SELECT section_id FROM assignments WHERE id IN (
          SELECT a.id FROM assignments a 
          JOIN sections sec ON a.section_id = sec.id 
          JOIN courses co ON sec.course_id = co.id 
          WHERE co.title LIKE '%Biology%'
        )
      ))
    `);
    console.log('Mahe Biology enrollment:', enrollment);

    // Test the actual query from StudentController for Mahe
    console.log('\n=== Testing StudentController Query for Mahe ===');
    
    // First get Mahe's actual user ID
    const [maheUser] = await connection.query("SELECT id, name FROM users WHERE name LIKE '%Mahe%'");
    console.log('Mahe user info:', maheUser);
    
    if (maheUser.length === 0) {
      console.log('No user found with name containing Mahe');
      return;
    }
    
    const maheId = maheUser[0].id;
    const [testAssignments] = await connection.query(`
      SELECT DISTINCT
        a.id,
        a.title,
        a.description,
        a.due_date,
        a.total_marks,
        a.created_at,
        c.title as course_name,
        c.course_code,
        c.id as course_id,
        s.id as submission_id,
        s.file_path as submission_file,
        s.submitted_at,
        s.grade,
        s.feedback,
        s.graded_at,
        CASE 
          WHEN s.id IS NOT NULL THEN 'submitted'
          WHEN a.due_date < NOW() THEN 'overdue'
          ELSE 'pending'
        END as status,
        DATEDIFF(a.due_date, NOW()) as days_remaining
      FROM enrollments e
      LEFT JOIN sections sec ON e.section_id = sec.id
      LEFT JOIN courses c ON COALESCE(sec.course_id, e.course_id) = c.id
      LEFT JOIN assignments a ON a.section_id = sec.id
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
      WHERE e.user_id = ? AND a.id IS NOT NULL
      ORDER BY a.due_date ASC, a.created_at DESC
    `, [maheId, maheId]);
    console.log('Assignments from StudentController query:', testAssignments);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkBiologyAssignments();