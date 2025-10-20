const mysql = require('mysql2/promise');

async function migrateData() {
  console.log('🔄 Starting Data Migration...\n');
  
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    // STEP 1: Create sections for courses that don't have any
    console.log('1️⃣ Creating missing sections...\n');
    const [coursesWithoutSections] = await conn.query(`
      SELECT c.id, c.course_code, c.title, c.teacher_id
      FROM courses c
      WHERE NOT EXISTS (SELECT 1 FROM sections WHERE course_id = c.id)
    `);

    if (coursesWithoutSections.length > 0) {
      console.log(`   Found ${coursesWithoutSections.length} courses without sections:`);
      
      for (const course of coursesWithoutSections) {
        const sectionName = `${course.course_code} - Section A`;
        const [result] = await conn.query(
          `INSERT INTO sections (course_id, teacher_id, name, max_capacity, current_enrollment) 
           VALUES (?, ?, ?, 50, 0)`,
          [course.id, course.teacher_id, sectionName]
        );
        console.log(`   ✅ Created section "${sectionName}" (ID: ${result.insertId}) for ${course.title}`);
      }
    } else {
      console.log('   ✅ All courses already have sections');
    }

    // STEP 2: Fix orphaned enrollments (section_id = NULL)
    console.log('\n2️⃣ Fixing orphaned enrollments...\n');
    const [orphanedEnrollments] = await conn.query(`
      SELECT e.id, e.user_id, e.course_id, u.name as student_name, c.course_code
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.section_id IS NULL
    `);

    if (orphanedEnrollments.length > 0) {
      console.log(`   Found ${orphanedEnrollments.length} orphaned enrollments`);
      
      for (const enrollment of orphanedEnrollments) {
        if (enrollment.course_id) {
          // Find first section for this course
          const [sections] = await conn.query(
            'SELECT id FROM sections WHERE course_id = ? LIMIT 1',
            [enrollment.course_id]
          );
          
          if (sections.length > 0) {
            // Check if user is already enrolled in this section
            const [existing] = await conn.query(
              'SELECT id FROM enrollments WHERE user_id = ? AND section_id = ? AND id != ?',
              [enrollment.user_id, sections[0].id, enrollment.id]
            );
            
            if (existing.length > 0) {
              // Delete duplicate enrollment
              await conn.query('DELETE FROM enrollments WHERE id = ?', [enrollment.id]);
              console.log(`   🗑️  Deleted duplicate enrollment for ${enrollment.student_name} (already enrolled in section)`);
            } else {
              // Update enrollment
              await conn.query(
                'UPDATE enrollments SET section_id = ? WHERE id = ?',
                [sections[0].id, enrollment.id]
              );
              console.log(`   ✅ Fixed enrollment for ${enrollment.student_name} → Section ${sections[0].id}`);
            }
          } else {
            console.log(`   ⚠️  No section found for course_id ${enrollment.course_id}, skipping enrollment ${enrollment.id}`);
          }
        } else {
          console.log(`   ⚠️  Enrollment ${enrollment.id} has no course_id, manually review needed`);
        }
      }
    } else {
      console.log('   ✅ No orphaned enrollments found');
    }

    // STEP 3: Update current_enrollment counts for all sections
    console.log('\n3️⃣ Updating enrollment counts...\n');
    await conn.query(`
      UPDATE sections s
      SET current_enrollment = (
        SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.section_id = s.id
      )
    `);
    console.log('   ✅ All section enrollment counts updated');

    // STEP 4: Assign teachers to sections based on course teacher
    console.log('\n4️⃣ Assigning teachers to sections...\n');
    const [result] = await conn.query(`
      UPDATE sections s
      JOIN courses c ON s.course_id = c.id
      SET s.teacher_id = c.teacher_id
      WHERE s.teacher_id IS NULL AND c.teacher_id IS NOT NULL
    `);
    console.log(`   ✅ Assigned teachers to ${result.affectedRows} sections`);

    // STEP 5: Show final statistics
    console.log('\n📊 FINAL DATABASE STATE:\n');
    
    const [courseCount] = await conn.query('SELECT COUNT(*) as count FROM courses');
    const [sectionCount] = await conn.query('SELECT COUNT(*) as count FROM sections');
    const [enrollmentCount] = await conn.query('SELECT COUNT(*) as count FROM enrollments');
    const [orphanCount] = await conn.query('SELECT COUNT(*) as count FROM enrollments WHERE section_id IS NULL');
    
    console.log(`   📚 Total Courses: ${courseCount[0].count}`);
    console.log(`   📑 Total Sections: ${sectionCount[0].count}`);
    console.log(`   👥 Total Enrollments: ${enrollmentCount[0].count}`);
    console.log(`   ⚠️  Orphaned Enrollments: ${orphanCount[0].count}`);

    // Show courses with their sections
    console.log('\n📋 Courses and Sections:');
    const [courseSections] = await conn.query(`
      SELECT 
        c.course_code,
        c.title,
        COUNT(s.id) as section_count,
        SUM(s.current_enrollment) as total_students
      FROM courses c
      LEFT JOIN sections s ON c.id = s.course_id
      GROUP BY c.id
      ORDER BY c.id
    `);
    console.table(courseSections);

    // Show sections with details
    console.log('\n📂 Section Details:');
    const [sectionDetails] = await conn.query(`
      SELECT 
        s.id,
        c.course_code,
        s.name,
        u.name as teacher,
        s.current_enrollment,
        s.max_capacity
      FROM sections s
      JOIN courses c ON s.course_id = c.id
      LEFT JOIN users u ON s.teacher_id = u.id
      ORDER BY c.id, s.id
    `);
    console.table(sectionDetails);

    console.log('\n✨ Data migration completed successfully!');
    console.log('\n🎉 Your database is now properly structured for section management!');
    console.log('\n📝 Next steps:');
    console.log('   1. Backend API implementation');
    console.log('   2. Frontend admin panel updates');
    console.log('   3. Test chat functionality');

    await conn.end();

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateData();
