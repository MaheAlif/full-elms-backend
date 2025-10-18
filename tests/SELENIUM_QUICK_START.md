# 🎯 Selenium Student Automation Test - Quick Guide

## 📦 What Was Created

I've created a comprehensive Selenium automation test suite for testing all student features in the ELMS platform.

### Files Created/Modified:

1. **`tests/selenium-student-test.js`** - Main test script (870+ lines)
2. **`tests/SELENIUM_TEST_README.md`** - Comprehensive documentation
3. **`tests/run-selenium-test.bat`** - Quick test runner for Windows
4. **`package.json`** - Added Selenium dependencies
5. **Frontend Components** - Added `data-testid` attributes for reliable element selection

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend Server
```bash
cd c:\xampp\htdocs\full-elms-backend
npm run dev
```
✅ Backend should be running on http://localhost:5000

### Step 2: Start Frontend
```bash
cd c:\xampp\htdocs\full-elms-backend\elms-uiu
npm run dev
```
✅ Frontend should be running on http://localhost:3000

### Step 3: Run Tests
**Option A: Use Batch File (Windows)**
```bash
cd c:\xampp\htdocs\full-elms-backend\tests
run-selenium-test.bat
```

**Option B: Use Node Directly**
```bash
cd c:\xampp\htdocs\full-elms-backend\tests
node selenium-student-test.js
```

## ✅ What Gets Tested

The automation test covers **8 complete workflows**:

1. ✅ **Student Login**
   - Navigate to login page
   - Select "Student" role from dropdown
   - Enter credentials: `sakib221131@bscse.uiu.ac.bd` / `password123`
   - Verify successful login and redirect to dashboard

2. ✅ **View Enrolled Courses**
   - Display list of enrolled courses
   - Verify course cards are present
   - Log course names and details

3. ✅ **View Course Materials**
   - Select a course
   - Navigate to Materials tab
   - Verify materials are displayed
   - Check material details (title, type, size)

4. ✅ **View Assignments**
   - Navigate to Assignments tab
   - Verify assignment list
   - Check assignment details (title, due date, status)

5. ✅ **Class Chat**
   - Navigate to Class Chat tab
   - Send a test message
   - Verify message input works

6. ✅ **Calendar View**
   - Navigate to Calendar tab
   - Verify calendar grid is displayed
   - Check for events

7. ✅ **AI Chatbot**
   - Navigate to AI Assistant tab
   - Verify chatbot interface is present

8. ✅ **Student Logout**
   - Click user menu
   - Click logout
   - Verify redirect to login page

## 📊 Test Output

### Console Output Example:
```
═══════════════════════════════════════════════════════
🎯 ELMS STUDENT FEATURE AUTOMATION TEST
═══════════════════════════════════════════════════════
User: sakib221131@bscse.uiu.ac.bd
Frontend: http://localhost:3000
Backend: http://localhost:5000
═══════════════════════════════════════════════════════

✅ Student Login: PASSED - Successfully logged in
✅ View Enrolled Courses: PASSED - Found 8 courses
✅ View Course Materials: PASSED - Found 7 materials
✅ View Assignments: PASSED - Found 6 assignments
✅ Class Chat: PASSED - Message sent successfully
✅ Calendar View: PASSED - Calendar is visible
✅ AI Chatbot: PASSED - AI Assistant interface accessible
✅ Student Logout: PASSED - Successfully logged out

═══════════════════════════════════════════════════════
📊 TEST EXECUTION SUMMARY
═══════════════════════════════════════════════════════

Total Tests: 8
✅ Passed: 8
❌ Failed: 0
📈 Pass Rate: 100.00%
```

### Generated Files:
- **Screenshots**: `tests/screenshots/` - Captured on errors
- **Reports**: `tests/test-reports/` - JSON format with timestamps
- **Logs**: Console output with detailed step-by-step execution

## 🔧 Test Configuration

Edit these values in `selenium-student-test.js` to customize:

```javascript
// Test URLs
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

// Test Credentials
const TEST_USER = {
  email: 'sakib221131@bscse.uiu.ac.bd',
  password: 'password123',
  role: 'student'
};

// Timeouts (milliseconds)
const TIMEOUT = 10000;        // 10 seconds
const LONG_TIMEOUT = 20000;   // 20 seconds
```

## 🎨 Browser Options

### Normal Mode (Default)
- Opens Chrome browser visibly
- You can watch the test execution
- Good for debugging

### Headless Mode
Uncomment in `selenium-student-test.js`:
```javascript
options.addArguments('--headless');
```
- Runs without opening browser window
- Faster execution
- Good for CI/CD pipelines

## 🛠️ Advanced Features

### 1. Screenshot on Error
- Automatically captures screenshots when tests fail
- Saves to `tests/screenshots/`
- Includes timestamp and error context

### 2. Test Reports
- JSON reports generated after each run
- Location: `tests/test-reports/`
- Contains detailed results, timestamps, and messages

### 3. Smart Element Selection
Uses `data-testid` attributes for reliable element selection:
```javascript
// Examples from the code:
await this.safeClick(By.css('[data-testid="login-email"]'));
await this.safeClick(By.css('[data-testid="course-card-1"]'));
await this.safeClick(By.css('[data-testid="materials-tab"]'));
```

### 4. Retry Logic
Built-in wait mechanisms:
- Implicit waits for all elements
- Explicit waits for specific conditions
- Smart delays after clicks/inputs

## 📋 Prerequisites Checklist

Before running tests, ensure:

- ✅ Node.js installed (v18+)
- ✅ Chrome browser installed (latest version)
- ✅ MySQL database running
- ✅ Backend server running on port 5000
- ✅ Frontend running on port 3000
- ✅ Test user exists in database
- ✅ Selenium packages installed (`npm install` already done)

## 🐛 Troubleshooting

### Problem: "Element not found"
**Solution**: Increase timeout values or check if frontend is fully loaded

### Problem: "ChromeDriver version mismatch"
**Solution**: 
```bash
npm install chromedriver@latest
```

### Problem: "Connection refused"
**Solution**: Make sure backend and frontend are both running

### Problem: Test user doesn't exist
**Solution**: 
```bash
mysql -u root -p < elms_clean_export.sql
```

### Problem: Slow execution
**Solution**: 
- Enable headless mode
- Check network connectivity
- Reduce timeout values if appropriate

## 📁 Project Structure

```
tests/
├── selenium-student-test.js      # Main test script
├── SELENIUM_TEST_README.md       # Detailed documentation
├── run-selenium-test.bat         # Windows test runner
├── screenshots/                  # Auto-generated screenshots
│   └── *.png
└── test-reports/                 # Auto-generated reports
    └── student-test-report_*.json
```

## 🎯 Test Credentials

**Student Account:**
- **Email**: `sakib221131@bscse.uiu.ac.bd`
- **Password**: `password123`
- **Role**: Student

This student should have:
- Multiple enrolled courses
- Course materials to view
- Assignments (pending/submitted)
- Access to class chat
- Calendar events visible

## 🚦 Running Tests in Different Scenarios

### Scenario 1: First Time Setup
```bash
# 1. Install dependencies (already done)
npm install

# 2. Start servers
npm run dev              # Backend (Terminal 1)
cd elms-uiu && npm run dev  # Frontend (Terminal 2)

# 3. Run tests
cd tests
node selenium-student-test.js
```

### Scenario 2: Quick Test Run
```bash
# Just run the batch file (servers should be running)
cd tests
run-selenium-test.bat
```

### Scenario 3: CI/CD Pipeline
```bash
# Headless mode for automated testing
# (Uncomment headless option in code first)
node selenium-student-test.js
```

## 📈 Test Metrics

The test measures:
- ✅ Pass/Fail status for each feature
- ⏱️ Execution time per test
- 📊 Overall pass rate percentage
- 🎯 Element interaction success
- 📸 Screenshots on failures

## 🎓 Learning Points

This test demonstrates:
1. **Page Object Model** - Organized test structure
2. **Wait Strategies** - Handling async operations
3. **Error Handling** - Screenshots and logging
4. **Test Reporting** - JSON reports and summaries
5. **Best Practices** - Reusable methods and clean code

## 🔄 Next Steps

To extend the tests:
1. Add file upload testing for assignments
2. Test material download functionality
3. Add AI chatbot interaction tests
4. Test form validations
5. Add performance metrics
6. Cross-browser testing (Firefox, Edge)

## 📞 Support

For issues or questions:
1. Check `SELENIUM_TEST_README.md` for detailed docs
2. Review screenshots in `tests/screenshots/`
3. Check test reports in `tests/test-reports/`
4. Verify all prerequisites are met

---

**Created**: October 17, 2025
**Test Version**: 1.0.0
**Browser**: Chrome (Latest)
**Framework**: Selenium WebDriver 4.21.0

## 🎉 You're All Set!

Just follow the 3-step Quick Start above and watch your student features get automatically tested! 🚀
