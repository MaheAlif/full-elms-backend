# 🧪 Selenium Student Workflow Test

## Overview
This test automates a complete student user journey through the ELMS platform, covering all major features from login to course interaction.

## Test Workflow

### 📋 Test Steps
1. **Login** - Navigate to login page and authenticate as student
2. **Credentials** - Fill in email and password
3. **Role Selection** - Confirm student role
4. **Submit Login** - Complete authentication
5. **Select Course** - Choose a course from the course list
6. **View Materials** - Browse all materials in the selected course
7. **View Assignments** - Check assignments for the course
8. **AI Chat** - Interact with the AI assistant
9. **Calendar** - View calendar and check for events
10. **Class Chat** - Send a message in the class chat

### 👤 Test User Credentials
- **Email**: sakib221131@bscse.uiu.ac.bd
- **Password**: password123
- **Role**: Student

## Prerequisites

### 1. Install Node.js Dependencies
```bash
npm install selenium-webdriver
```

### 2. Install Chrome WebDriver
```bash
# Windows (using npm)
npm install chromedriver

# Or download manually from:
# https://chromedriver.chromium.org/downloads
```

### 3. Ensure Backend and Frontend are Running
```bash
# Terminal 1 - Backend
cd c:\xampp\htdocs\full-elms-backend
npm run dev

# Terminal 2 - Frontend
cd c:\xampp\htdocs\full-elms-backend\elms-uiu
npm run dev
```

## Running the Test

### Quick Start
```bash
cd c:\xampp\htdocs\full-elms-backend
node tests/selenium-student-full-workflow.js
```

### Expected Output
```
╔════════════════════════════════════════════════════════════╗
║     SELENIUM STUDENT WORKFLOW TEST - STARTING            ║
╚════════════════════════════════════════════════════════════╝

🎯 Test User: sakib221131@bscse.uiu.ac.bd
🌐 Frontend URL: http://localhost:3000
🔧 Backend URL: http://localhost:5000

✅ Step 1: Navigate to login page
✅ Step 2: Fill in login credentials
✅ Step 3: Select student role
✅ Step 4: Submit login form
✅ Step 5: Select a course from the course list
✅ Step 6: View all materials of the selected course
✅ Step 7: View assignments
✅ Step 8: Select AI chat and send a message
✅ Step 9: Select calendar and check for events
✅ Step 10: Go to class chat and send a message
✅ Step 11: Take final screenshot and verify all steps

🎉 ALL TESTS PASSED! Student workflow completed successfully!
```

## Screenshots

Screenshots are automatically saved in `./test-screenshots/` directory with timestamps.

Example screenshots:
- `01_login_page.png` - Initial login page
- `04_dashboard_loaded.png` - Dashboard after successful login
- `05_course_selected.png` - Selected course view
- `06_materials_viewed.png` - Course materials
- `08_ai_chat_interaction.png` - AI assistant interaction
- `09_calendar_events.png` - Calendar view with events
- `10_class_chat_message_sent.png` - Class chat with sent message
- `11_final_state.png` - Final state of the application

## Customization

### Change Test User
Edit the `CONFIG` object in the test file:
```javascript
const CONFIG = {
  STUDENT_EMAIL: 'your-email@example.com',
  STUDENT_PASSWORD: 'your-password',
  // ... other config
};
```

### Adjust Timeouts
Modify the timeout values if your application is slower:
```javascript
const CONFIG = {
  TIMEOUT: 20000, // Increase to 20 seconds
  // ... other config
};
```

### Change URLs
Update the frontend and backend URLs:
```javascript
const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:5000',
  // ... other config
};
```

## Troubleshooting

### Issue: Chrome driver not found
**Solution**: Install chromedriver
```bash
npm install chromedriver
```

### Issue: Element not found
**Solution**: Increase timeout or check if the frontend is running
```bash
# Check if frontend is accessible
curl http://localhost:3000
```

### Issue: Login fails
**Solution**: Verify credentials and backend connection
```bash
# Test backend API
curl http://localhost:5000/api/health
```

### Issue: Screenshots not saving
**Solution**: Create the directory manually
```bash
mkdir test-screenshots
```

## Test Configuration

### Test User Database Setup
Ensure the test user exists in your database:
```sql
SELECT * FROM users WHERE email = 'sakib221131@bscse.uiu.ac.bd';
```

If the user doesn't exist, you can create one:
```sql
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Sakib Ahmed', 'sakib221131@bscse.uiu.ac.bd', 
        '$2b$10$hashedpassword', 'student');
```

### Course Enrollment
Make sure the test user is enrolled in at least one course:
```sql
SELECT c.*, e.* 
FROM courses c
JOIN sections s ON c.id = s.course_id
JOIN enrollments e ON s.id = e.section_id
WHERE e.user_id = (SELECT id FROM users WHERE email = 'sakib221131@bscse.uiu.ac.bd');
```

## Advanced Usage

### Run with custom screenshot directory
```bash
SCREENSHOT_DIR=./my-screenshots node tests/selenium-student-full-workflow.js
```

### Debug mode (keep browser open)
Edit the test file and change the sleep time before closing:
```javascript
await driver.sleep(30000); // Keep open for 30 seconds
```

### Run headless (no browser window)
Add headless option:
```javascript
chromeOptions.addArguments('--headless');
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Selenium Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Start backend
        run: npm run dev &
      - name: Start frontend
        run: cd elms-uiu && npm run dev &
      - name: Wait for services
        run: sleep 10
      - name: Run Selenium test
        run: node tests/selenium-student-full-workflow.js
```

## Test Results

The test generates a detailed JSON report with:
- ✅ Success/failure status for each step
- ⏱️ Duration of test execution
- 📸 Screenshot paths
- 📊 Overall test summary

## Support

For issues or questions:
1. Check the console output for detailed error messages
2. Review the screenshots in `./test-screenshots/`
3. Verify backend and frontend are running
4. Check the test user exists in the database

## License
MIT License - Feel free to modify and use as needed!
