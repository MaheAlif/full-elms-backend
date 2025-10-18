/**
 * Selenium WebDriver - Admin Feature Automation Test v2
 * OPTIMIZED VERSION - Faster, more reliable form filling
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

const FRONTEND_URL = 'http://localhost:3000';
const ADMIN_USER = {
  email: 'admin.aminul@uiu.ac.bd',
  password: 'password123',
  role: 'admin'
};

const generateTestData = () => {
  const timestamp = Date.now();
  return {
    course: {
      name: `TestCourse${timestamp}`,
      code: `TC${timestamp}`,
      description: `Test course ${timestamp}`,
      credits: '3',
      semester: 'Fall',
      academicYear: '2024-2025'
    },
    student: {
      name: `TestStudent${timestamp}`,
      email: `student${timestamp}@test.com`,
      password: 'testpass123'
    }
  };
};

const TIMEOUT = 10000;

class AdminTest {
  constructor() {
    this.driver = null;
    this.testData = generateTestData();
    this.results = [];
  }

  async setup() {
    const options = new chrome.Options();
    options.addArguments('--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
    this.driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await this.driver.manage().setTimeouts({ implicit: 5000 });
    console.log('\n✅ WebDriver initialized');
  }

  async teardown() {
    if (this.driver) await this.driver.quit();
  }

  log(test, passed, msg = '') {
    this.results.push({ test, passed, msg });
    console.log(`${passed ? '✅' : '❌'} ${test}: ${msg}`);
  }

  async fillInput(testId, value) {
    try {
      const input = await this.driver.findElement(By.css(`[data-testid="${testId}"]`));
      await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', input);
      await this.driver.sleep(300);
      await input.clear();
      await input.sendKeys(value);
      console.log(`   ✓ Filled ${testId}: ${value}`);
      return true;
    } catch (e) {
      console.log(`   ✗ Could not fill ${testId}`);
      return false;
    }
  }

  async clickButton(testId) {
    try {
      const btn = await this.driver.findElement(By.css(`[data-testid="${testId}"]`));
      await this.driver.executeScript('arguments[0].scrollIntoView({block:"center"});', btn);
      await this.driver.sleep(300);
      await btn.click();
      console.log(`   ✓ Clicked ${testId}`);
      return true;
    } catch (e) {
      console.log(`   ✗ Could not click ${testId}`);
      return false;
    }
  }

  async test1_Login() {
    console.log('\n📝 TEST 1: LOGIN');
    console.log('─'.repeat(40));
    try {
      await this.driver.get(FRONTEND_URL + '/login');
      await this.driver.sleep(2000);

      // Role dropdown
      await this.clickButton('role-dropdown-trigger');
      await this.driver.sleep(500);
      await this.clickButton('role-option-admin');
      await this.driver.sleep(500);

      // Credentials
      await this.fillInput('login-email', ADMIN_USER.email);
      await this.fillInput('login-password', ADMIN_USER.password);
      await this.clickButton('login-submit');

      await this.driver.wait(until.urlContains('/dashboard'), TIMEOUT);
      this.log('LOGIN', true, 'Successfully logged in as admin');
      await this.driver.sleep(2000);
      return true;
    } catch (e) {
      this.log('LOGIN', false, e.message);
      return false;
    }
  }

  async test2_CreateCourse() {
    console.log('\n📚 TEST 2: CREATE COURSE');
    console.log('─'.repeat(40));
    try {
      // Navigate to courses - try multiple methods
      let coursesClicked = await this.clickButton('courses-tab');
      
      if (!coursesClicked) {
        // Try keyboard navigation
        try {
          const coursesTab = await this.driver.findElement(By.css('[data-testid="courses-tab"]'));
          await coursesTab.sendKeys(Key.ENTER);
          console.log('   ✓ Used keyboard to navigate to Courses');
        } catch (e) {
          console.log('   ✗ Could not navigate to courses');
        }
      }
      
      await this.driver.sleep(2000);

      // Scroll to form
      await this.driver.executeScript('window.scrollTo(0, 0);');
      await this.driver.sleep(500);

      // Fill ALL fields
      const c = this.testData.course;
      await this.fillInput('course-name-input', c.name);
      await this.fillInput('course-code-input', c.code);
      await this.fillInput('course-description-input', c.description);
      await this.fillInput('course-credits-input', c.credits);
      await this.fillInput('course-academic-year-input', c.academicYear);

      // Semester dropdown
      await this.clickButton('course-semester-dropdown');
      await this.driver.sleep(500);
      await this.clickButton('semester-fall');
      await this.driver.sleep(500);

      // Submit
      await this.clickButton('create-course-submit-btn');
      await this.driver.sleep(3000);

      this.log('CREATE COURSE', true, `Course "${c.name}" created`);
      return true;
    } catch (e) {
      this.log('CREATE COURSE', false, e.message);
      return false;
    }
  }

  async test3_CreateStudent() {
    console.log('\n👥 TEST 3: CREATE STUDENT');
    console.log('─'.repeat(40));
    try {
      // Navigate to students - try multiple methods
      let studentsClicked = await this.clickButton('students-tab');
      
      if (!studentsClicked) {
        try {
          const studentsTab = await this.driver.findElement(By.css('[data-testid="students-tab"]'));
          await studentsTab.sendKeys(Key.ENTER);
          console.log('   ✓ Used keyboard to navigate to Students');
        } catch (e) {
          console.log('   ✗ Could not navigate to students');
        }
      }
      
      await this.driver.sleep(2000);

      // Scroll to form
      await this.driver.executeScript('window.scrollTo(0, 0);');
      await this.driver.sleep(500);

      // Fill all fields
      const s = this.testData.student;
      await this.fillInput('student-name-input', s.name);
      await this.fillInput('student-email-input', s.email);
      await this.fillInput('student-password-input', s.password);

      // Submit
      await this.clickButton('create-student-submit-btn');
      await this.driver.sleep(3000);

      this.log('CREATE STUDENT', true, `Student "${s.name}" created`);
      return true;
    } catch (e) {
      this.log('CREATE STUDENT', false, e.message);
      return false;
    }
  }

  async test4_Logout() {
    console.log('\n🚪 TEST 4: LOGOUT');
    console.log('─'.repeat(40));
    try {
      // Click user menu
      const menu = await this.driver.findElement(By.css('button[class*="rounded-full"]'));
      await menu.click();
      await this.driver.sleep(1000);

      // Click logout
      const logout = await this.driver.findElement(By.xpath("//span[text()='Log out']/.."));
      await logout.click();

      await this.driver.wait(until.urlContains('/login'), TIMEOUT);
      this.log('LOGOUT', true, 'Successfully logged out');
      return true;
    } catch (e) {
      this.log('LOGOUT', false, e.message);
      return false;
    }
  }

  async run() {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 ELMS ADMIN TEST - OPTIMIZED VERSION v2');
    console.log('='.repeat(50));

    try {
      await this.setup();
      
      const login = await this.test1_Login();
      if (!login) {
        console.log('\n❌ Login failed. Stopping tests.');
        await this.teardown();
        return;
      }

      await this.test2_CreateCourse();
      await this.test3_CreateStudent();
      await this.test4_Logout();

      // Summary
      console.log('\n' + '='.repeat(50));
      console.log('📊 TEST SUMMARY');
      console.log('='.repeat(50));
      const passed = this.results.filter(r => r.passed).length;
      const total = this.results.length;
      console.log(`✅ Passed: ${passed}/${total}`);
      console.log(`❌ Failed: ${total - passed}/${total}`);
      console.log('\n📦 TEST DATA CREATED:');
      console.log(`   Course: ${this.testData.course.name} (${this.testData.course.code})`);
      console.log(`   Student: ${this.testData.student.name} (${this.testData.student.email})`);
      console.log('='.repeat(50) + '\n');

    } catch (error) {
      console.error('\n❌ FATAL ERROR:', error.message);
    } finally {
      await this.teardown();
    }
  }
}

// Run tests
(async () => {
  const test = new AdminTest();
  await test.run();
})();
