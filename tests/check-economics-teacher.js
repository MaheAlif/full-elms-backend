const mysql = require('mysql2/promise');

async function checkEconomicsTeacher() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elms'
  });

  console.log('\n=== CHECKING ECONOMICS COURSE ===\n');

  // Check Economics course
  const [courses] = await db.execute(
    'SELECT id, title, course_code, teacher_id FROM courses WHERE title LIKE ?',
    ['%Economics%']
  );
  console.log('Economics Course:', courses);

  // Check Economics sections
  if (courses.length > 0) {
    const courseId = courses[0].id;
    const [sections] = await db.execute(
      'SELECT id, course_id, name, teacher_id FROM sections WHERE course_id = ?',
      [courseId]
    );
    console.log('\nEconomics Sections:', sections);
  }

  // Check Sarah Johnson
  const [sarah] = await db.execute(
    'SELECT id, name, email FROM users WHERE email LIKE ?',
    ['%sarah%']
  );
  console.log('\nSarah Johnson:', sarah);

  // Check what courses Sarah can see (using the same query as TeacherController)
  if (sarah.length > 0) {
    const sarahId = sarah[0].id;
    const [sarahCourses] = await db.execute(`
      SELECT 
        c.id,
        c.title as course_name,
        c.course_code,
        c.teacher_id
      FROM courses c
      WHERE c.teacher_id = ?
    `, [sarahId]);
    
    console.log('\nCourses Sarah can see (via courses.teacher_id):', sarahCourses);

    // Check what courses Sarah is assigned to via sections
    const [sarahSectionCourses] = await db.execute(`
      SELECT DISTINCT
        c.id,
        c.title as course_name,
        c.course_code,
        s.name as section_name,
        s.teacher_id as section_teacher_id
      FROM sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.teacher_id = ?
    `, [sarahId]);
    
    console.log('\nCourses Sarah is assigned to via sections:', sarahSectionCourses);
  }

  await db.end();
}

checkEconomicsTeacher().catch(console.error);
