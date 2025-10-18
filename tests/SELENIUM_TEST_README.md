# 🤖 Selenium Automation Test Guide - Student Features

## Overview

This Selenium automation test suite covers the complete student workflow in the ELMS platform, from login to all major features.

## Test Coverage

### ✅ Tests Included

1. **Student Login** - Tests login functionality with student credentials
2. **View Enrolled Courses** - Verifies course list display
3. **View Course Materials** - Tests material browsing and display
4. **View Assignments** - Checks assignment list and details
5. **Class Chat** - Tests real-time chat functionality
6. **Calendar View** - Verifies calendar and event display
7. **AI Chatbot** - Tests AI assistant interface
8. **Student Logout** - Verifies logout and session cleanup

## Prerequisites

### 1. Backend Server Running
```bash
cd c:\xampp\htdocs\full-elms-backend
npm run dev
```
Backend should be running on: `http://localhost:5000`

### 2. Frontend Running
```bash
cd c:\xampp\htdocs\full-elms-backend\elms-uiu
npm run dev
```
Frontend should be running on: `http://localhost:3000`

### 3. Database Setup
- Ensure MySQL is running
- Database should have test data loaded
- Test user should exist: `sakib221131@bscse.uiu.ac.bd` with password `password123`

### 4. Chrome Browser
- Chrome browser must be installed
- ChromeDriver is automatically managed by the package

## Installation

Install Selenium dependencies (already done):
```bash
cd c:\xampp\htdocs\full-elms-backend
npm install selenium-webdriver chromedriver
```

## Running the Tests

### Quick Start
```bash
cd c:\xampp\htdocs\full-elms-backend\tests
node selenium-student-test.js
```

### Run in Headless Mode
Edit `selenium-student-test.js` and uncomment:
```javascript
options.addArguments('--headless');
```

## Test Configuration

You can modify test settings at the top of `selenium-student-test.js`:

```javascript
// Test Configuration
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'sakib221131@bscse.uiu.ac.bd',
  password: 'password123',
  role: 'student'
};

// Timeout settings
const TIMEOUT = 10000; // 10 seconds
const LONG_TIMEOUT = 20000; // 20 seconds
```

## Test Output

### Console Output
The test will display:
- ✅ Passed tests with green checkmarks
- ❌ Failed tests with red X marks
- Detailed step-by-step execution logs
- Final summary with pass/fail counts

### Screenshots
Screenshots are automatically captured on errors:
- Location: `tests/screenshots/`
- Named with timestamp and error context

### Test Reports
JSON reports are generated after each run:
- Location: `tests/test-reports/`
- Contains detailed results and timestamps
- Format: `student-test-report_[timestamp].json`

## Example Output

```
═══════════════════════════════════════════════════════
🎯 ELMS STUDENT FEATURE AUTOMATION TEST
═══════════════════════════════════════════════════════
User: sakib221131@bscse.uiu.ac.bd
Frontend: http://localhost:3000
Backend: http://localhost:5000
═══════════════════════════════════════════════════════

🚀 Setting up Selenium WebDriver...
✅ WebDriver initialized successfully

📋 Test 1: Student Login
──────────────────────────────────────────────────────
   → Navigated to http://localhost:3000/login
   → Clicked: Role dropdown
   → Clicked: Student role option
   → Typed into: Email input
   → Typed into: Password input
   → Clicked: Login button
   → Redirected to: http://localhost:3000/dashboard
✅ Student Login: PASSED - Successfully logged in and redirected to dashboard

📋 Test 2: View Enrolled Courses
──────────────────────────────────────────────────────
   → Found 8 enrolled courses
   → Course 1: CSEN1011: Introduction to Programming
   → Course 2: CSEN1031: Data Structures & Algorithms
   → Course 3: CSEN2011: Database Management Systems
✅ View Enrolled Courses: PASSED - Found 8 courses

... [additional tests]

═══════════════════════════════════════════════════════
📊 TEST EXECUTION SUMMARY
═══════════════════════════════════════════════════════

Total Tests: 8
✅ Passed: 8
❌ Failed: 0
📈 Pass Rate: 100.00%

──────────────────────────────────────────────────────
DETAILED RESULTS:
──────────────────────────────────────────────────────
1. ✅ Student Login - PASS
   Successfully logged in and redirected to dashboard
2. ✅ View Enrolled Courses - PASS
   Found 8 courses
... [more results]
```

## Troubleshooting

### Common Issues

#### 1. "Element not found" errors
- **Cause**: Frontend not fully loaded or data-testid attributes missing
- **Solution**: Increase timeout values or wait for frontend to stabilize

#### 2. ChromeDriver version mismatch
```bash
# Update chromedriver
npm install chromedriver@latest
```

#### 3. Connection refused
- **Cause**: Backend or frontend not running
- **Solution**: 
  ```bash
  # Terminal 1 - Backend
  cd c:\xampp\htdocs\full-elms-backend
  npm run dev

  # Terminal 2 - Frontend
  cd c:\xampp\htdocs\full-elms-backend\elms-uiu
  npm run dev
  ```

#### 4. Test user doesn't exist
- **Cause**: Database not properly seeded
- **Solution**: Run database setup script:
  ```bash
  mysql -u root -p < elms_clean_export.sql
  ```

#### 5. Slow test execution
- Enable headless mode for faster execution
- Reduce `TIMEOUT` values if tests are too slow
- Check network connectivity

## Advanced Usage

### Run Specific Test
Modify `runAllTests()` method to run only specific tests:

```javascript
async runAllTests() {
  await this.setup();
  
  // Run only specific tests
  await this.testLogin();
  await this.testViewCourses();
  // Comment out other tests
  
  this.generateReport();
  await this.teardown();
}
```

### Custom Test User
Change the `TEST_USER` object to test with different credentials:

```javascript
const TEST_USER = {
  email: 'your-email@uiu.ac.bd',
  password: 'your-password',
  role: 'student'
};
```

### Debugging Mode
Add more detailed logging:

```javascript
// Add at the start of any test method
console.log('DEBUG: Current URL:', await this.driver.getCurrentUrl());
console.log('DEBUG: Page title:', await this.driver.getTitle());
```

## Browser Automation Tips

### Wait Strategies
The test uses multiple wait strategies:
- **Implicit Wait**: 10 seconds default
- **Explicit Wait**: For specific elements
- **Sleep**: For animations and transitions

### Element Selection
Elements are selected using `data-testid` attributes:
- Most reliable for testing
- Not affected by styling changes
- Clear intent in code

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Selenium Tests

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
      - name: Run Selenium tests
        run: node tests/selenium-student-test.js
```

## Best Practices

1. **Always check prerequisites** before running tests
2. **Run tests in a clean environment** to avoid state issues
3. **Check screenshots** on failures for debugging
4. **Review test reports** for patterns in failures
5. **Keep ChromeDriver updated** with your Chrome browser version

## Support & Issues

If you encounter issues:
1. Check the screenshots in `tests/screenshots/`
2. Review test reports in `tests/test-reports/`
3. Verify all prerequisites are met
4. Check browser console for errors
5. Ensure backend API is responding

## Test Credentials

**Student Account:**
- Email: `sakib221131@bscse.uiu.ac.bd`
- Password: `password123`
- Role: Student

This user should have:
- Multiple enrolled courses
- Access to materials
- Assignments to view
- Chat room access
- Calendar events

## Future Enhancements

Potential additions to the test suite:
- [ ] File upload testing (assignment submissions)
- [ ] Material download verification
- [ ] AI chatbot interaction testing
- [ ] Performance metrics collection
- [ ] Cross-browser testing (Firefox, Edge)
- [ ] Mobile responsive testing
- [ ] Accessibility testing

---

**Last Updated:** October 17, 2025
**Test Version:** 1.0.0
**Compatibility:** Chrome 120+, Node.js 18+
