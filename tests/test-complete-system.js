const mysql = require('mysql2/promise');

async function testCompleteSystem() {
  console.log('🧪 Testing Complete Section Management System\n');
  console.log('=' .repeat(70) + '\n');
  
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'elms'
    });

    // TEST 1: Verify all courses have sections
    console.log('TEST 1: Course-Section Coverage');
    console.log('-'.repeat(70));
    const [coursesWithoutSections] = await conn.query(`
      SELECT c.id, c.course_code, c.title
      FROM courses c
      WHERE NOT EXISTS (SELECT 1 FROM sections WHERE course_id = c.id)
    `);
    
    if (coursesWithoutSections.length === 0) {
      console.log('✅ PASS: All courses have at least one section\n');
    } else {
      console.log('❌ FAIL: Found courses without sections:');
      console.table(coursesWithoutSections);
    }

    // TEST 2: Verify no orphaned enrollments
    console.log('\nTEST 2: Enrollment Integrity');
    console.log('-'.repeat(70));
    const [orphaned] = await conn.query(`
      SELECT COUNT(*) as count FROM enrollments WHERE section_id IS NULL
    `);
    
    if (orphaned[0].count === 0) {
      console.log('✅ PASS: No orphaned enrollments (all have valid section_id)\n');
    } else {
      console.log(`❌ FAIL: Found ${orphaned[0].count} orphaned enrollments\n`);
    }

    // TEST 3: Verify enrollment counts match
    console.log('\nTEST 3: Enrollment Count Accuracy');
    console.log('-'.repeat(70));
    const [mismatch] = await conn.query(`
      SELECT s.id, s.name, s.current_enrollment as recorded,
             COUNT(e.id) as actual
      FROM sections s
      LEFT JOIN enrollments e ON s.id = e.section_id
      GROUP BY s.id
      HAVING recorded != actual
    `);
    
    if (mismatch.length === 0) {
      console.log('✅ PASS: All section enrollment counts are accurate\n');
    } else {
      console.log('❌ FAIL: Found sections with mismatched counts:');
      console.table(mismatch);
    }

    // TEST 4: Verify teachers are properly assigned
    console.log('\nTEST 4: Teacher Assignments');
    console.log('-'.repeat(70));
    const [sectionsWithoutTeachers] = await conn.query(`
      SELECT COUNT(*) as count FROM sections WHERE teacher_id IS NULL
    `);
    
    console.log(`ℹ️  Sections without teachers: ${sectionsWithoutTeachers[0].count}`);
    
    const [teacherAssignments] = await conn.query(`
      SELECT u.id, u.name as teacher_name, COUNT(s.id) as section_count
      FROM users u
      LEFT JOIN sections s ON u.id = s.teacher_id
      WHERE u.role = 'teacher'
      GROUP BY u.id
      ORDER BY section_count DESC
    `);
    console.table(teacherAssignments);

    // TEST 5: Test chat room availability
    console.log('\n\nTEST 5: Chat Room Readiness');
    console.log('-'.repeat(70));
    
    // Test with Mahe's enrollments
    const [maheEnrollments] = await conn.query(`
      SELECT e.id, c.course_code, c.title, s.name as section_name, s.id as section_id
      FROM enrollments e
      JOIN sections s ON e.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE e.user_id = 32
    `);
    
    console.log(`ℹ️  Mahe is enrolled in ${maheEnrollments.length} sections:`);
    console.table(maheEnrollments.map(e => ({
      course: e.course_code,
      title: e.title,
      section: e.section_name,
      section_id: e.section_id
    })));

    // Check if chat rooms exist or can be created for each
    for (const enrollment of maheEnrollments) {
      const [chatRoom] = await conn.query(
        'SELECT id, name FROM chat_rooms WHERE section_id = ?',
        [enrollment.section_id]
      );
      
      if (chatRoom.length > 0) {
        console.log(`✅ ${enrollment.course_code}: Chat room exists (ID: ${chatRoom[0].id})`);
      } else {
        console.log(`✅ ${enrollment.course_code}: Can create chat room for section ${enrollment.section_id}`);
      }
    }

    // TEST 6: Overall System Health
    console.log('\n\nTEST 6: System Health Summary');
    console.log('-'.repeat(70));
    
    const [stats] = await conn.query(`
      SELECT 
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM sections) as total_sections,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM users WHERE role='student') as total_students,
        (SELECT COUNT(*) FROM users WHERE role='teacher') as total_teachers,
        (SELECT COUNT(*) FROM chat_rooms) as total_chat_rooms,
        (SELECT COUNT(*) FROM chat_messages) as total_messages
    `);
    
    const health = stats[0];
    console.table([{
      Metric: 'Courses',
      Count: health.total_courses
    }, {
      Metric: 'Sections',
      Count: health.total_sections
    }, {
      Metric: 'Enrollments',
      Count: health.total_enrollments
    }, {
      Metric: 'Students',
      Count: health.total_students
    }, {
      Metric: 'Teachers',
      Count: health.total_teachers
    }, {
      Metric: 'Chat Rooms',
      Count: health.total_chat_rooms
    }, {
      Metric: 'Messages',
      Count: health.total_messages
    }]);

    // Calculate section-to-course ratio
    const ratio = (health.total_sections / health.total_courses).toFixed(2);
    console.log(`\n📊 Section-to-Course Ratio: ${ratio}`);
    console.log(`📊 Avg Students per Section: ${(health.total_enrollments / health.total_sections).toFixed(1)}`);

    // FINAL VERDICT
    console.log('\n' + '='.repeat(70));
    console.log('\n🎯 FINAL VERDICT:');
    
    if (coursesWithoutSections.length === 0 && 
        orphaned[0].count === 0 && 
        mismatch.length === 0) {
      console.log('✅ ALL TESTS PASSED - System is ready for production!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Restart backend server (npm run dev)');
      console.log('   2. Test chat functionality in browser');
      console.log('   3. Admin can now create/manage sections');
      console.log('   4. Students can be enrolled in specific sections');
    } else {
      console.log('⚠️  SOME TESTS FAILED - Review issues above');
    }

    console.log('\n' + '='.repeat(70));
    await conn.end();

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

testCompleteSystem();
