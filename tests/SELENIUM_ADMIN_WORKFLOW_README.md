# 🔐 Selenium Admin Complete Workflow Test

## Overview
This test automates the complete admin workflow in ELMS, from login to creating courses, sections, teachers, students, and managing enrollments.

## Test Admin Credentials
- **Email:** admin.aminul@uiu.ac.bd
- **Password:** password123
- **Role:** Admin

## Test Workflow (12 Steps)

### 1. **Login**
- Navigates to login page
- Fills admin credentials
- Selects admin role
- Submits login form

### 2. **Create Course**
- Navigates to Courses tab
- Clicks "Create Course" button
- Fills course information:
  - Title: `Test Course [timestamp]`
  - Code: `TC[timestamp]`
  - Description: Auto-generated
- Submits course form

### 3. **Create Section**
- Navigates to Sections tab
- Clicks "Create Section" button
- Selects the newly created course
- Fills section information:
  - Name: `Section A-[timestamp]`
  - Schedule: "Monday, Wednesday 10:00 AM - 11:30 AM"
- Submits section form

### 4. **Create Teacher**
- Navigates to Teachers tab
- Clicks "Create Teacher" button
- Fills teacher information:
  - Name: `Test Teacher [timestamp]`
  - Email: `teacher[timestamp]@test.uiu.ac.bd`
  - Password: password123
- Submits teacher form

### 5. **Assign Teacher to Section**
- Returns to Sections tab
- Finds the created section
- Clicks Edit/Assign button
- Selects the newly created teacher
- Saves the assignment

### 6. **Create Student**
- Navigates to Students tab
- Clicks "Create Student" button
- Fills student information:
  - Name: `Test Student [timestamp]`
  - Email: `student[timestamp]@test.uiu.ac.bd`
  - Student ID: `STU[timestamp]`
  - Password: password123
- Submits student form

### 7. **Assign Student to Section**
- Returns to Sections tab
- Finds the created section
- Clicks Manage Students/Enroll button
- Clicks "Add Student" button
- Selects the newly created student
- Saves the enrollment

### 8. **Logout**
- Clicks profile menu (if available)
- Clicks logout button
- Returns to login page

## Running the Test

### Prerequisites
1. **Backend server** running on `http://localhost:5000`
2. **Frontend server** running on `http://localhost:3000`
3. **Chrome browser** installed
4. **ChromeDriver** installed and in PATH
5. **Node.js** installed with required dependencies

### Install Dependencies
```bash
cd tests
npm install selenium-webdriver
```

### Run the Test
```bash
cd tests
node selenium-admin-complete-workflow.js
```

## Test Output

### Console Output
```
SELENIUM ADMIN WORKFLOW TEST - STARTING

Test Admin: admin.aminul@uiu.ac.bd
Frontend URL: http://localhost:3000
Backend URL: http://localhost:5000

[Step 1] Navigate to login page
   Screenshot saved: test-screenshots/2025-10-19T..._01_login_page.png
   Status: SUCCESS - Login page loaded

[Step 2] Fill in admin login credentials
   Email entered: admin.aminul@uiu.ac.bd
   Password entered
   Status: SUCCESS - Credentials filled

[Step 3] Select admin role
   Admin role selected
   Status: SUCCESS - Role selected/confirmed

[Step 4] Submit login form
   Login button clicked
   Status: SUCCESS - Login successful, admin dashboard loaded

[Step 5] Navigate to Courses tab and create a new course
   Courses tab clicked
   Create Course button clicked
   Course title entered: Test Course 1729356789123
   Course code entered: TC1729356789123
   Course form submitted
   Status: SUCCESS - Course created: Test Course 1729356789123

[Step 6] Navigate to Sections tab and create a section
   Sections tab clicked
   Create Section button clicked
   Selected course: Test Course 1729356789123
   Section name entered: Section A-1729356789123
   Section form submitted
   Status: SUCCESS - Section created: Section A-1729356789123

[Step 7] Navigate to Teachers tab and create a teacher
   Teachers tab clicked
   Create Teacher button clicked
   Teacher name entered: Test Teacher 1729356789123
   Teacher email entered: teacher1729356789123@test.uiu.ac.bd
   Teacher form submitted
   Status: SUCCESS - Teacher created: Test Teacher 1729356789123

[Step 8] Assign teacher to the course section
   Sections tab clicked
   Edit/Assign teacher button clicked
   Selected teacher: Test Teacher 1729356789123
   Teacher assignment saved
   Status: SUCCESS - Teacher assigned to section

[Step 9] Navigate to Students tab and create a student
   Students tab clicked
   Create Student button clicked
   Student name entered: Test Student 1729356789123
   Student email entered: student1729356789123@test.uiu.ac.bd
   Student form submitted
   Status: SUCCESS - Student created: Test Student 1729356789123

[Step 10] Assign student to the section
   Sections tab clicked
   Manage students button clicked
   Add Student button clicked
   Selected student: Test Student 1729356789123
   Student enrollment saved
   Status: SUCCESS - Student enrolled in section

[Step 11] Logout from admin account
   Profile menu clicked
   Logout button clicked
   Status: SUCCESS - Logged out successfully

[Step 12] Take final screenshot and verify all steps
   Status: SUCCESS - All steps completed

================================================================================
TEST EXECUTION SUMMARY
================================================================================

Total Steps: 12
Passed: 12
Failed: 0
Duration: 95.45 seconds
Success Rate: 100.0%

COLLECTED DATA:
Course Created: Test Course 1729356789123
Section Created: Section A-1729356789123
Teacher Created: Test Teacher 1729356789123
Student Created: Test Student 1729356789123

TEST RESULT: PASSED - All test steps completed successfully

TEST REPORTS GENERATED:
HTML Report: test-reports/test-report-2025-10-19T...-...Z.html
JSON Report: test-reports/test-report-2025-10-19T...-...Z.json
Markdown Report: test-reports/test-report-2025-10-19T...-...Z.md
CSV Report: test-reports/test-report-2025-10-19T...-...Z.csv
```

## Generated Files

### Screenshots (12 screenshots)
1. `01_login_page.png` - Initial login page
2. `02_credentials_filled.png` - Credentials entered
3. `03_role_selected.png` - Admin role selected
4. `04_dashboard_loaded.png` - Dashboard after login
5. `05_course_form_filled.png` - Course form with data
6. `05_course_created.png` - Course successfully created
7. `06_section_form_filled.png` - Section form with data
8. `06_section_created.png` - Section successfully created
9. `07_teacher_form_filled.png` - Teacher form with data
10. `07_teacher_created.png` - Teacher successfully created
11. `08_teacher_assignment_filled.png` - Teacher assignment form
12. `08_teacher_assigned.png` - Teacher assigned to section
13. `09_student_form_filled.png` - Student form with data
14. `09_student_created.png` - Student successfully created
15. `10_student_enrollment_filled.png` - Student enrollment form
16. `10_student_enrolled.png` - Student enrolled in section
17. `11_logged_out.png` - After logout
18. `12_final_state.png` - Final state

### Reports (4 formats)
- **HTML Report** - Interactive web-based report with styling
- **JSON Report** - Structured data for programmatic access
- **Markdown Report** - Documentation-friendly format
- **CSV Report** - Spreadsheet-compatible format

## Test Data

All test data is automatically generated with timestamps to avoid conflicts:

```javascript
{
  course: {
    title: "Test Course 1729356789123",
    code: "TC1729356789123",
    description: "Automated test course created by Selenium"
  },
  section: {
    name: "Section A-1729356789123",
    schedule: "Monday, Wednesday 10:00 AM - 11:30 AM"
  },
  teacher: {
    name: "Test Teacher 1729356789123",
    email: "teacher1729356789123@test.uiu.ac.bd",
    password: "password123"
  },
  student: {
    name: "Test Student 1729356789123",
    email: "student1729356789123@test.uiu.ac.bd",
    studentId: "STU1729356789123",
    password: "password123"
  }
}
```

## Troubleshooting

### Test Fails at Login
- **Issue:** Login credentials incorrect
- **Solution:** Verify admin user exists with email `admin.aminul@uiu.ac.bd`
- **Check:** Run `node tests/check-users.js` to verify admin exists

### Element Not Found Errors
- **Issue:** UI structure changed or elements have different selectors
- **Solution:** Check screenshots to see what page the test is on
- **Fix:** Update XPath selectors in the test file

### Timeouts
- **Issue:** Application loading slowly
- **Solution:** Increase `CONFIG.TIMEOUT` value (default: 5000ms)
- **Location:** Line 30 in the test file

### Already Exists Errors
- **Issue:** Course/teacher/student with same name already exists
- **Solution:** Test uses timestamps to generate unique names
- **Check:** Ensure timestamp generation is working (line 36)

## Configuration

### Modify URLs
```javascript
const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',  // Change if frontend on different port
  BACKEND_URL: 'http://localhost:5000',   // Change if backend on different port
  ADMIN_EMAIL: 'admin.aminul@uiu.ac.bd',
  ADMIN_PASSWORD: 'password123',
  TIMEOUT: 5000,  // Increase if app is slow
  SCREENSHOT_DIR: './test-screenshots',
};
```

### Run in Headless Mode
Add to Chrome options (line 160):
```javascript
options.addArguments('--headless');
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Admin Workflow Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Start backend
        run: npm run dev &
      - name: Start frontend
        run: cd elms-uiu && npm run dev &
      - name: Wait for services
        run: sleep 30
      - name: Run admin workflow test
        run: node tests/selenium-admin-complete-workflow.js
      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: test-screenshots
          path: tests/test-screenshots/
```

## Comparison with Other Tests

| Test | User Type | Steps | Duration | Focus |
|------|-----------|-------|----------|-------|
| `selenium-student-full-workflow.js` | Student | 10 | ~35s | Student experience |
| `selenium-admin-complete-workflow.js` | Admin | 12 | ~95s | Full admin workflow |
| `selenium-admin-test-v2.js` | Admin | 8 | ~60s | Quick admin features |

## Success Criteria

✅ **100% Success Rate** - All 12 steps pass  
✅ **Course Created** - New course visible in database  
✅ **Section Created** - Section linked to course  
✅ **Teacher Created** - Teacher account created  
✅ **Teacher Assigned** - Teacher linked to section  
✅ **Student Created** - Student account created  
✅ **Student Enrolled** - Student enrolled in section  
✅ **Logout Successful** - Admin logged out cleanly  

---

**Created:** October 19, 2025  
**Test Type:** E2E Admin Workflow  
**Platform:** Selenium WebDriver + Chrome  
**Author:** Automated Testing Suite
