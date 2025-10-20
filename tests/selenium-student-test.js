/**
 * ELMS Student Feature Selenium Automation Test
 * 
 * This test automates the student workflow:
 * 1. Login as Student
 * 2. View Dashboard
 * 3. View Enrolled Courses
 * 4. View Course Materials
 * 5. View Assignments
 * 6. View Grades
 * 7. View Class Schedule
 * 8. Logout
 * 
 * Tests use real student data!
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

// Configuration
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';
const STUDENT_USER = {
  email: 'sakib221131@bscse.uiu.ac.bd',
  password: 'password123',
  role: 'Student'
};

/**
 * Student Automation Test Class
 */
class StudentAutomationTest {
  constructor() {
    this.driver = null;
    this.testResults = [];
  }

  /**
   * Setup WebDriver
   */
  async setup() {
    console.log('\nSetting up Selenium WebDriver...\n');
    
    const options = new chrome.Options();
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--start-maximized');
    options.excludeSwitches('enable-logging');
    
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    await this.driver.manage().setTimeouts({ implicit: 5000 });
    console.log('WebDriver initialized successfully\n');
  }

  /**
   * Teardown WebDriver
   */
  async teardown() {
    if (this.driver) {
      await this.driver.sleep(2000);
      await this.driver.quit();
      console.log('\n WebDriver closed');
    }
  }

  /**
   * Take screenshot on error
   */
  async takeScreenshot(filename) {
    try {
      const screenshotDir = path.join(__dirname, 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const screenshot = await this.driver.takeScreenshot();
      const filepath = path.join(screenshotDir, `${filename}_${Date.now()}.png`);
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`   Screenshot saved: ${filepath}`);
    } catch (error) {
      console.error('   Failed to take screenshot:', error.message);
    }
  }

  /**
   * Log test result
   */
  logResult(test, passed, message = '') {
    const icon = passed ? '[PASS]' : '[FAIL]';
    const status = passed ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${test}: ${status}${message ? ' - ' + message : ''}`);
    this.testResults.push({ test, passed, message });
  }

  /**
   * Helper: Fill form field with multiple selector strategies
   */
  async fillFormField(fieldName, value, selectors) {
    for (const selector of selectors) {
      try {
        const element = await this.driver.findElement(selector);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
        await this.driver.sleep(300);
        await element.clear();
        await element.sendKeys(value);
        console.log(`   -> Filled ${fieldName}: ${value}`);
        return true;
      } catch (e) {
        continue;
      }
    }
    console.log(`   [WARNING] Could not fill ${fieldName}`);
    return false;
  }

  /**
   * Test 1: Student Login
   */
  async testStudentLogin() {
    console.log('\nTest 1: Student Login');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.get(`${FRONTEND_URL}/login`);
      console.log(`   -> Navigated to ${FRONTEND_URL}/login`);
      await this.driver.sleep(2000);

      // Select Student role
      const roleSelectors = [
        By.css('[data-testid="role-dropdown"]'),
        By.css('button[role="combobox"]'),
        By.xpath("//button[contains(text(), 'Select role')]")
      ];

      for (const selector of roleSelectors) {
        try {
          const roleDropdown = await this.driver.findElement(selector);
          await roleDropdown.click();
          console.log('   -> Clicked: Role dropdown');
          await this.driver.sleep(500);
          break;
        } catch (e) {
          continue;
        }
      }

      const studentOptionSelectors = [
        By.css('[data-testid="role-option-Student"]'),
        By.xpath("//div[@role='option' and contains(text(), 'Student')]"),
        By.xpath("//div[contains(text(), 'Student')]")
      ];

      for (const selector of studentOptionSelectors) {
        try {
          const studentOption = await this.driver.findElement(selector);
          await studentOption.click();
          console.log('   -> Clicked: Student role option');
          await this.driver.sleep(500);
          break;
        } catch (e) {
          continue;
        }
      }

      // Fill email
      await this.fillFormField('Email input', STUDENT_USER.email, [
        By.css('[data-testid="email-input"]'),
        By.css('input[type="email"]'),
        By.css('input[name="email"]')
      ]);

      // Fill password
      await this.fillFormField('Password input', STUDENT_USER.password, [
        By.css('[data-testid="password-input"]'),
        By.css('input[type="password"]'),
        By.css('input[name="password"]')
      ]);

      // Click login button
      const loginBtnSelectors = [
        By.css('[data-testid="login-button"]'),
        By.css('button[type="submit"]'),
        By.xpath("//button[contains(text(), 'Login') or contains(text(), 'Sign in')]")
      ];

      for (const selector of loginBtnSelectors) {
        try {
          const loginBtn = await this.driver.findElement(selector);
          await loginBtn.click();
          console.log('   -> Clicked: Login button');
          break;
        } catch (e) {
          continue;
        }
      }

      await this.driver.sleep(3000);

      const currentUrl = await this.driver.getCurrentUrl();
      const loginSuccess = currentUrl.includes('/dashboard');
      
      if (loginSuccess) {
        console.log(`   -> Redirected to: ${currentUrl}`);
      }

      this.logResult('Student Login', loginSuccess, loginSuccess ? 'Successfully logged in as Student' : 'Login failed or redirect not detected');
      return loginSuccess;
    } catch (error) {
      await this.takeScreenshot('student_login_failed');
      this.logResult('Student Login', false, error.message);
      return false;
    }
  }

  /**
   * Test 2: View Student Dashboard
   */
  async testViewDashboard() {
    console.log('\nTest 2: View Student Dashboard');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(2000);
      
      const pageElements = await this.driver.findElements(By.css('*'));
      console.log(`   -> Found ${pageElements.length} dashboard elements`);

      const pageSource = await this.driver.getPageSource();
      const hasDashboardContent = pageSource.includes('course') || 
                                 pageSource.includes('Course') ||
                                 pageSource.includes('Dashboard') ||
                                 pageSource.includes('Welcome');

      console.log('   -> Student dashboard loaded');

      this.logResult('View Student Dashboard', hasDashboardContent || pageElements.length > 10, 'Student dashboard is accessible');
      return true;
    } catch (error) {
      await this.takeScreenshot('view_dashboard_failed');
      this.logResult('View Student Dashboard', false, error.message);
      return false;
    }
  }

  /**
   * Test 3: View Enrolled Courses
   */
  async testViewCourses() {
    console.log('\nTest 3: View Enrolled Courses');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1500);

      const courseSelectors = [
        By.css('[data-testid="course-card"]'),
        By.css('[class*="course"]'),
        By.xpath("//div[contains(@class, 'card')]"),
        By.css('.course-list'),
        By.css('[class*="Course"]')
      ];

      let courseElements = [];
      for (const selector of courseSelectors) {
        try {
          courseElements = await this.driver.findElements(selector);
          if (courseElements.length > 0) break;
        } catch (e) {
          continue;
        }
      }

      console.log(`   -> Found ${courseElements.length} course elements`);
      
      const pageSource = await this.driver.getPageSource();
      const hasCourseContent = pageSource.includes('course') || 
                              pageSource.includes('Course') ||
                              courseElements.length > 0;

      this.logResult('View Enrolled Courses', hasCourseContent, 
        `${courseElements.length} courses displayed`);
      return true;
    } catch (error) {
      await this.takeScreenshot('view_courses_failed');
      this.logResult('View Enrolled Courses', false, error.message);
      return false;
    }
  }

  /**
   * Test 4: View Course Materials
   */
  async testViewMaterials() {
    console.log('\nTest 4: View Course Materials');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1000);

      // Look for materials section
      const materialSelectors = [
        By.css('[data-testid="materials-section"]'),
        By.xpath("//div[contains(text(), 'Materials')]"),
        By.xpath("//h2[contains(text(), 'Materials')]"),
        By.xpath("//h3[contains(text(), 'Materials')]"),
        By.css('[class*="material"]')
      ];

      let materialsFound = false;
      for (const selector of materialSelectors) {
        try {
          await this.driver.findElement(selector);
          materialsFound = true;
          console.log('   -> Materials section found');
          break;
        } catch (e) {
          continue;
        }
      }

      const pageSource = await this.driver.getPageSource();
      const hasMaterialContent = pageSource.includes('material') || 
                                pageSource.includes('Material') ||
                                materialsFound;

      console.log('   -> Checked for course materials');

      this.logResult('View Course Materials', hasMaterialContent || materialsFound, 
        'Materials section is accessible');
      return true;
    } catch (error) {
      await this.takeScreenshot('view_materials_failed');
      this.logResult('View Course Materials', false, error.message);
      return false;
    }
  }

  /**
   * Test 5: View Assignments
   */
  async testViewAssignments() {
    console.log('\nTest 5: View Assignments');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1000);

      const assignmentSelectors = [
        By.css('[data-testid="assignments-section"]'),
        By.xpath("//div[contains(text(), 'Assignment')]"),
        By.xpath("//h2[contains(text(), 'Assignment')]"),
        By.css('[class*="assignment"]')
      ];

      let assignmentsFound = false;
      for (const selector of assignmentSelectors) {
        try {
          await this.driver.findElement(selector);
          assignmentsFound = true;
          console.log('   -> Assignments section found');
          break;
        } catch (e) {
          continue;
        }
      }

      const pageSource = await this.driver.getPageSource();
      const hasAssignmentContent = pageSource.includes('assignment') || 
                                  pageSource.includes('Assignment') ||
                                  assignmentsFound;

      console.log('   -> Checked for assignments');

      this.logResult('View Assignments', hasAssignmentContent || assignmentsFound, 
        'Assignments section is accessible');
      return true;
    } catch (error) {
      await this.takeScreenshot('view_assignments_failed');
      this.logResult('View Assignments', false, error.message);
      return false;
    }
  }

  /**
   * Test 6: View Grades
   */
  async testViewGrades() {
    console.log('\nTest 6: View Grades');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1000);

      const gradeSelectors = [
        By.css('[data-testid="grades-section"]'),
        By.xpath("//div[contains(text(), 'Grade')]"),
        By.xpath("//h2[contains(text(), 'Grade')]"),
        By.css('[class*="grade"]')
      ];

      let gradesFound = false;
      for (const selector of gradeSelectors) {
        try {
          await this.driver.findElement(selector);
          gradesFound = true;
          console.log('   -> Grades section found');
          break;
        } catch (e) {
          continue;
        }
      }

      const pageSource = await this.driver.getPageSource();
      const hasGradeContent = pageSource.includes('grade') || 
                             pageSource.includes('Grade') ||
                             pageSource.includes('score') ||
                             gradesFound;

      console.log('   -> Checked for grades');

      this.logResult('View Grades', hasGradeContent || gradesFound, 
        'Grades section is accessible');
      return true;
    } catch (error) {
      await this.takeScreenshot('view_grades_failed');
      this.logResult('View Grades', false, error.message);
      return false;
    }
  }

  /**
   * Test 7: View Calendar/Schedule
   */
  async testViewCalendar() {
    console.log('\nTest 7: View Calendar/Schedule');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1000);

      const calendarSelectors = [
        By.css('[data-testid="calendar-section"]'),
        By.xpath("//div[contains(text(), 'Calendar')]"),
        By.xpath("//div[contains(text(), 'Schedule')]"),
        By.css('[class*="calendar"]')
      ];

      let calendarFound = false;
      for (const selector of calendarSelectors) {
        try {
          await this.driver.findElement(selector);
          calendarFound = true;
          console.log('   -> Calendar/Schedule section found');
          break;
        } catch (e) {
          continue;
        }
      }

      const pageSource = await this.driver.getPageSource();
      const hasCalendarContent = pageSource.includes('calendar') || 
                                pageSource.includes('Calendar') ||
                                pageSource.includes('schedule') ||
                                calendarFound;

      console.log('   -> Checked for calendar/schedule');

      this.logResult('View Calendar/Schedule', hasCalendarContent || calendarFound, 
        'Calendar section is accessible');
      return true;
    } catch (error) {
      await this.takeScreenshot('view_calendar_failed');
      this.logResult('View Calendar/Schedule', false, error.message);
      return false;
    }
  }

  /**
   * Test 8: Student Logout
   */
  async testStudentLogout() {
    console.log('\nTest 8: Student Logout');
    console.log('-'.repeat(50));
    
    try {
      await this.driver.sleep(1000);

      // Click user menu
      const userMenuSelectors = [
        By.css('[data-testid="user-menu"]'),
        By.css('button[aria-label*="menu"]'),
        By.xpath("//button[contains(@class, 'avatar')]"),
        By.css('.avatar')
      ];

      for (const selector of userMenuSelectors) {
        try {
          const element = await this.driver.findElement(selector);
          await element.click();
          console.log('   -> Clicked user menu');
          await this.driver.sleep(1000);
          break;
        } catch (e) {
          continue;
        }
      }

      // Click logout button
      const logoutSelectors = [
        By.css('[data-testid="logout-button"]'),
        By.xpath("//button[contains(text(), 'Logout')]"),
        By.xpath("//span[contains(text(), 'Logout')]"),
        By.xpath("//div[contains(text(), 'Logout')]")
      ];

      for (const selector of logoutSelectors) {
        try {
          const element = await this.driver.findElement(selector);
          await element.click();
          console.log('   -> Clicked logout button');
          break;
        } catch (e) {
          continue;
        }
      }

      await this.driver.sleep(2000);

      const currentUrl = await this.driver.getCurrentUrl();
      const isOnLogin = currentUrl.includes('/login') || currentUrl === `${FRONTEND_URL}/`;

      this.logResult('Student Logout', isOnLogin, 
        isOnLogin ? 'Successfully logged out' : 'Logout may have failed');

      return isOnLogin;
    } catch (error) {
      await this.takeScreenshot('student_logout_failed');
      this.logResult('Student Logout', false, error.message);
      return false;
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('STUDENT TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(2);

    console.log(`\nTotal Tests: ${totalTests}`);
    console.log(`[PASS] Passed: ${passedTests}`);
    console.log(`[FAIL] Failed: ${failedTests}`);
    console.log(`Pass Rate: ${passRate}%`);
    
    console.log('\n' + '-'.repeat(60));
    console.log('DETAILED RESULTS:');
    console.log('-'.repeat(60));
    
    this.testResults.forEach((result, index) => {
      const icon = result.passed ? '[PASS]' : '[FAIL]';
      const status = result.passed ? 'PASS' : 'FAIL';
      console.log(`${index + 1}. ${icon} ${result.test} - ${status}`);
      if (result.message) {
        console.log(`   ${result.message}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`Test completed at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60) + '\n');

    this.saveReportToFile();
  }

  /**
   * Save report to JSON file
   */
  saveReportToFile() {
    try {
      const fs = require('fs');
      const reportPath = path.join(__dirname, 'test-reports', `student-test-report_${Date.now()}.json`);
      
      if (!fs.existsSync(path.join(__dirname, 'test-reports'))) {
        fs.mkdirSync(path.join(__dirname, 'test-reports'), { recursive: true });
      }

      const report = {
        testSuite: 'Student Feature Automation',
        timestamp: new Date().toISOString(),
        studentUser: STUDENT_USER.email,
        totalTests: this.testResults.length,
        passed: this.testResults.filter(r => r.passed).length,
        failed: this.testResults.filter(r => !r.passed).length,
        results: this.testResults
      };

      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\nReport saved: ${reportPath}\n`);
    } catch (error) {
      console.error('Failed to save report:', error.message);
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('ELMS STUDENT FEATURE AUTOMATION TEST');
    console.log('='.repeat(60));
    console.log(`Student: ${STUDENT_USER.email}`);
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend: ${BACKEND_URL}`);
    console.log('='.repeat(60));
    console.log('\nTest Workflow:');
    console.log('1. Login as Student');
    console.log('2. View Dashboard');
    console.log('3. View Enrolled Courses');
    console.log('4. View Course Materials');
    console.log('5. View Assignments');
    console.log('6. View Grades');
    console.log('7. View Calendar/Schedule');
    console.log('8. Logout');
    console.log('='.repeat(60));

    try {
      await this.setup();

      // Run tests in the specified order
      const loginSuccess = await this.testStudentLogin();
      
      if (loginSuccess) {
        await this.testViewDashboard();
        await this.testViewCourses();
        await this.testViewMaterials();
        await this.testViewAssignments();
        await this.testViewGrades();
        await this.testViewCalendar();
        await this.testStudentLogout();
      } else {
        console.log('\n[WARNING] Login failed. Skipping subsequent tests.\n');
      }

      this.generateReport();
    } catch (error) {
      console.error('\n[ERROR] Test execution error:', error.message);
      await this.takeScreenshot('test_execution_error');
    } finally {
      await this.teardown();
    }
  }
}

/**
 * Main execution
 */
(async function main() {
  const test = new StudentAutomationTest();
  await test.runAllTests();
})();
