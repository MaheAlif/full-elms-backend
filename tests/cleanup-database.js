const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function cleanupDatabase() {
  let connection;
  
  try {
    console.log('🧹 Starting Database Cleanup...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'elms',
      multipleStatements: true
    });

    console.log('✅ Connected to database\n');

    // 1. Remove old 2024 calendar events
    console.log('📅 Removing old 2024 calendar events...');
    const [calendarResult] = await connection.execute(
      'DELETE FROM calendar_events WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18)'
    );
    console.log(`   ✓ Deleted ${calendarResult.affectedRows} calendar events\n`);

    // 2. Remove old 2024 submissions
    console.log('📤 Removing old 2024 submissions...');
    const [submissionsResult] = await connection.execute(
      "DELETE FROM submissions WHERE submitted_at < '2025-01-01'"
    );
    console.log(`   ✓ Deleted ${submissionsResult.affectedRows} submissions\n`);

    // 3. Remove old 2024 assignments
    console.log('📝 Removing old 2024 assignments...');
    const [assignmentsResult] = await connection.execute(
      'DELETE FROM assignments WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)'
    );
    console.log(`   ✓ Deleted ${assignmentsResult.affectedRows} assignments\n`);

    // 4. Remove test university events
    console.log('🏫 Removing test university events...');
    const [eventsResult] = await connection.execute(
      'DELETE FROM university_events WHERE id IN (9, 10, 11, 12, 13, 14)'
    );
    console.log(`   ✓ Deleted ${eventsResult.affectedRows} university events\n`);

    // 5. Fix Economics course teacher
    console.log('👨‍🏫 Fixing Economics course teacher assignment...');
    const [updateResult] = await connection.execute(
      'UPDATE courses SET teacher_id = 5 WHERE id = 10 AND teacher_id IS NULL'
    );
    console.log(`   ✓ Updated ${updateResult.affectedRows} course(s)\n`);

    // Verification
    console.log('=' .repeat(60));
    console.log('📊 VERIFICATION RESULTS');
    console.log('=' .repeat(60));

    // Check remaining assignments
    const [assignments] = await connection.execute(`
      SELECT id, title, due_date,
             CASE 
                 WHEN due_date < '2025-01-01' THEN 'OLD (Should be removed)'
                 ELSE 'CURRENT (OK)'
             END as status
      FROM assignments ORDER BY due_date
    `);
    console.log(`\n📝 Remaining Assignments: ${assignments.length}`);
    assignments.forEach(a => {
      const status = a.status === 'CURRENT (OK)' ? '✅' : '❌';
      console.log(`   ${status} ID ${a.id}: ${a.title.substring(0, 30)} (${a.due_date.toISOString().split('T')[0]})`);
    });

    // Check remaining submissions
    const [submissions] = await connection.execute(`
      SELECT COUNT(*) as count,
             SUM(CASE WHEN submitted_at < '2025-01-01' THEN 1 ELSE 0 END) as old_count,
             SUM(CASE WHEN submitted_at >= '2025-01-01' THEN 1 ELSE 0 END) as new_count
      FROM submissions
    `);
    console.log(`\n📤 Remaining Submissions: ${submissions[0].count} total`);
    console.log(`   ✅ Current (2025): ${submissions[0].new_count}`);
    if (submissions[0].old_count > 0) {
      console.log(`   ❌ Old (2024): ${submissions[0].old_count} (Should be 0!)`);
    }

    // Check university events
    const [events] = await connection.execute(`
      SELECT id, title, date, type, priority FROM university_events ORDER BY date
    `);
    console.log(`\n🏫 Remaining University Events: ${events.length}`);
    events.forEach(e => {
      console.log(`   ✅ ID ${e.id}: ${e.title} (${e.date.toISOString().split('T')[0]}) - ${e.priority}`);
    });

    // Check calendar events
    const [calEvents] = await connection.execute(`
      SELECT COUNT(*) as count,
             SUM(CASE WHEN date < '2025-01-01' THEN 1 ELSE 0 END) as old_count,
             SUM(CASE WHEN date >= '2025-01-01' THEN 1 ELSE 0 END) as new_count
      FROM calendar_events
    `);
    console.log(`\n📅 Remaining Calendar Events: ${calEvents[0].count} total`);
    console.log(`   ✅ Current (2025): ${calEvents[0].new_count}`);
    if (calEvents[0].old_count > 0) {
      console.log(`   ❌ Old (2024): ${calEvents[0].old_count} (Should be 0!)`);
    }

    // Check courses with teachers
    const [courses] = await connection.execute(`
      SELECT c.id, c.course_code, c.title, 
             CASE 
                 WHEN c.teacher_id IS NULL THEN 'NO TEACHER (ERROR)'
                 ELSE u.name
             END as teacher_name
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY c.id
    `);
    console.log(`\n📚 Courses with Teacher Assignments:`);
    courses.forEach(c => {
      const status = c.teacher_name.includes('ERROR') ? '❌' : '✅';
      console.log(`   ${status} ${c.course_code}: ${c.title.substring(0, 25).padEnd(25)} - ${c.teacher_name}`);
    });

    console.log('\n' + '=' .repeat(60));
    console.log('✅ CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log('\n📋 Summary:');
    console.log(`   • Removed ${assignmentsResult.affectedRows} old 2024 assignments`);
    console.log(`   • Removed ${submissionsResult.affectedRows} old 2024 submissions`);
    console.log(`   • Removed ${calendarResult.affectedRows} old 2024 calendar events`);
    console.log(`   • Removed ${eventsResult.affectedRows} test university events`);
    console.log(`   • Fixed ${updateResult.affectedRows} course teacher assignment(s)`);
    console.log('\n🎯 Kept:');
    console.log('   • All users (including Debug User and Test User)');
    console.log('   • All 2025 assignments (including test-1, Biology A-1 Lab, etc.)');
    console.log('   • All recent submissions from 2025');
    console.log('   • All 2025 calendar events');
    console.log('   • All meaningful university events');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run cleanup
cleanupDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
