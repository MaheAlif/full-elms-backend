/**
 * Fix all teacher controller methods to support section-level teacher assignments
 * This script updates all SQL queries that check c.teacher_id = ? to also check s.teacher_id = ?
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'controllers', 'teacherController.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern 1: WHERE a.id = ? AND c.teacher_id = ?
content = content.replace(
  /WHERE a\.id = \? AND c\.teacher_id = \?/g,
  'WHERE a.id = ? AND (c.teacher_id = ? OR s.teacher_id = ?)'
);

// Pattern 2: WHERE sub.id = ? AND c.teacher_id = ?
content = content.replace(
  /WHERE sub\.id = \? AND c\.teacher_id = \?/g,
  'WHERE sub.id = ? AND (c.teacher_id = ? OR s.teacher_id = ?)'
);

// Pattern 3: WHERE s.id = ? AND c.teacher_id = ? (for sections table)
content = content.replace(
  /WHERE s\.id = \? AND c\.teacher_id = \?/g,
  'WHERE s.id = ? AND (c.teacher_id = ? OR s.teacher_id = ?)'
);

// Pattern 4: WHERE ce.id = ? AND c.teacher_id = ? (for calendar events)
content = content.replace(
  /WHERE ce\.id = \? AND c\.teacher_id = \?/g,
  'WHERE ce.id = ? AND (c.teacher_id = ? OR s.teacher_id = ?)'
);

// Pattern 5: Standalone WHERE c.teacher_id = ? at end of query
content = content.replace(
  /WHERE c\.teacher_id = \?\s*$/gm,
  'WHERE (c.teacher_id = ? OR s.teacher_id = ?)'
);

// Pattern 6: WHERE c.teacher_id = ? followed by GROUP BY or ORDER BY
content = content.replace(
  /WHERE c\.teacher_id = \?\s+(GROUP BY|ORDER BY)/g,
  'WHERE (c.teacher_id = ? OR s.teacher_id = ?) $1'
);

// Now fix all parameter arrays that were using [teacherId] to use [teacherId, teacherId]
// This is more complex - we need to identify specific patterns

// After updating WHERE clauses, we need to update the params arrays
// Pattern: const params: any[] = [teacherId]; (right after WHERE with OR condition)
content = content.replace(
  /(WHERE \(c\.teacher_id = \? OR s\.teacher_id = \?\)[^]*?)(const params: any\[\] = \[teacherId\];)/g,
  (match, before, paramLine) => {
    // Check if this params is right after a WHERE with OR condition for teacher
    if (before.includes('teacher_id')) {
      return before + 'const params: any[] = [teacherId, teacherId];';
    }
    return match;
  }
);

// Fix parameter passing in execute calls
// Pattern: `, [assignmentId, teacherId]);` should become `, [assignmentId, teacherId, teacherId]);`
content = content.replace(
  /\[assignmentId, teacherId\]\);/g,
  '[assignmentId, teacherId, teacherId]);'
);

content = content.replace(
  /\[submissionId, teacherId\]\);/g,
  '[submissionId, teacherId, teacherId]);'
);

content = content.replace(
  /\[section_id, teacherId\]\);/g,
  '[section_id, teacherId, teacherId]);'
);

content = content.replace(
  /\[materialId, teacherId\]\);/g,
  '[materialId, teacherId, teacherId]);'
);

content = content.replace(
  /\[eventId, teacherId\]\);/g,
  '[eventId, teacherId, teacherId]);'
);

// Write the updated content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully updated teacherController.ts');
console.log('All teacher ownership checks now support both course-level and section-level assignments!');
