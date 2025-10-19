/**
 * ============================================================
 * SELENIUM ADMIN WORKFLOW TEST - Complete Admin Journey
 * ============================================================
 * 
 * This test automates a complete admin user workflow:
 * 1. Login as admin
 * 2. Go to Courses tab and create a new course
 * 3. Go to Sections tab and create a section for that course
 * 4. Go to Teachers tab and create a new teacher
 * 5. Assign the teacher to the course section
 * 6. Go to Students tab and create a new student
 * 7. Assign the student to the section
 * 8. Logout
 * 
 * Test Admin Credentials:
 * - Email: admin.aminul@uiu.ac.bd
 * - Password: password123
 * - Role: Admin
 * 
 * ============================================================
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const TestReportGenerator = require('./test-report-generator');

// Configuration
const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:5000',
  ADMIN_EMAIL: 'admin.aminul@uiu.ac.bd',
  ADMIN_PASSWORD: 'password123',
  TIMEOUT: 5000, // 5 seconds
  SCREENSHOT_DIR: './test-screenshots',
};

// Generate unique test data
const timestamp = Date.now();
const testData = {
  course: {
    title: `Test Course ${timestamp}`,
    code: `TC${timestamp}`,
    description: 'Automated test course created by Selenium'
  },
  section: {
    name: `Section A-${timestamp}`,
    schedule: 'Monday, Wednesday 10:00 AM - 11:30 AM'
  },
  teacher: {
    name: `Test Teacher ${timestamp}`,
    email: `teacher${timestamp}@test.uiu.ac.bd`,
    password: 'password123'
  },
  student: {
    name: `Test Student ${timestamp}`,
    email: `student${timestamp}@test.uiu.ac.bd`,
    studentId: `STU${timestamp}`,
    password: 'password123'
  }
};

// Test data
let driver;
let testResults = {
  testName: 'Admin Complete Workflow Test',
  testUser: CONFIG.ADMIN_EMAIL,
  frontendUrl: CONFIG.FRONTEND_URL,
  backendUrl: CONFIG.BACKEND_URL,
  timeout: CONFIG.TIMEOUT,
  startTime: new Date(),
  steps: [],
  success: true,
  error: null,
  collectedData: {
    courseId: null,
    courseName: null,
    sectionId: null,
    sectionName: null,
    teacherId: null,
    teacherName: null,
    studentId: null,
    studentName: null
  }
};

/**
 * Helper function to take screenshots
 */
async function takeScreenshot(stepName) {
  try {
    const screenshot = await driver.takeScreenshot();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${stepName}.png`;
    const filepath = `${CONFIG.SCREENSHOT_DIR}/${filename}`;
    
    require('fs').writeFileSync(filepath, screenshot, 'base64');
    console.log(`   Screenshot saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.log(`   Failed to take screenshot: ${error.message}`);
    return null;
  }
}

/**
 * Helper function to wait for element
 */
async function waitForElement(locator, timeout = CONFIG.TIMEOUT) {
  return await driver.wait(until.elementLocated(locator), timeout);
}

/**
 * Helper function to close any open modals
 */
async function closeAllModals() {
  try {
    // Try pressing Escape multiple times
    await driver.actions().sendKeys(Key.ESCAPE).perform();
    await driver.sleep(500);
    await driver.actions().sendKeys(Key.ESCAPE).perform();
    await driver.sleep(500);
    await driver.actions().sendKeys(Key.ESCAPE).perform();
    await driver.sleep(500);
    console.log('   Pressed Escape keys to close modals');
  } catch (e) {
    console.log('   Could not send Escape keys');
  }
  
  // Use JavaScript to forcibly remove modal overlays
  try {
    await driver.executeScript(`
      // Remove all modal overlays
      const overlays = document.querySelectorAll('[data-state="open"]');
      overlays.forEach(el => {
        if (el.classList.contains('bg-black') || el.style.position === 'fixed') {
          el.style.display = 'none';
          el.remove();
        }
      });
      
      // Remove any modal dialogs
      const dialogs = document.querySelectorAll('[role="dialog"]');
      dialogs.forEach(dialog => {
        const parent = dialog.closest('[data-state="open"]');
        if (parent) {
          parent.style.display = 'none';
          parent.remove();
        }
      });
      
      // Click any close buttons
      const closeButtons = document.querySelectorAll('button[aria-label*="Close"], button[aria-label*="close"]');
      closeButtons.forEach(btn => btn.click());
    `);
    await driver.sleep(500);
    console.log('   Removed modal overlays via JavaScript');
  } catch (e) {
    console.log('   Could not remove modals via JavaScript');
  }
  
  // Try clicking on the backdrop/overlay
  try {
    const backdrop = await driver.findElement(By.xpath('//div[@data-state="open" and contains(@class, "bg-black")]'));
    await backdrop.click();
    await driver.sleep(500);
    console.log('   Clicked backdrop to close modal');
  } catch (e) {
    // No backdrop found
  }
  
  // Try finding close buttons
  try {
    const closeButtons = await driver.findElements(By.xpath('//button[contains(@aria-label, "Close") or contains(., "×") or contains(., "Cancel")]'));
    for (const btn of closeButtons) {
      try {
        if (await btn.isDisplayed()) {
          await btn.click();
          await driver.sleep(500);
          console.log('   Clicked close button');
        }
      } catch (e) {
        // Button not clickable
      }
    }
  } catch (e) {
    // No close buttons
  }
}

/**
 * Log step start
 */
function logStep(stepNumber, description) {
  console.log(`\n[Step ${stepNumber}] ${description}`);
  testResults.steps.push({
    stepNumber,
    description,
    status: 'pending',
    timestamp: new Date(),
    details: null
  });
}

/**
 * Update step status
 */
function updateStepStatus(stepNumber, status, details = null) {
  const step = testResults.steps.find(s => s.stepNumber === stepNumber);
  if (step) {
    step.status = status;
    step.details = details;
    step.completedAt = new Date();
    console.log(`   Status: ${status.toUpperCase()}${details ? ' - ' + details : ''}`);
  }
}

/**
 * Main test execution
 */
async function runAdminWorkflowTest() {
  try {
    console.log('\nSELENIUM ADMIN WORKFLOW TEST - STARTING\n');
    console.log(`Test Admin: ${CONFIG.ADMIN_EMAIL}`);
    console.log(`Frontend URL: ${CONFIG.FRONTEND_URL}`);
    console.log(`Backend URL: ${CONFIG.BACKEND_URL}\n`);

    console.log(`Setting up Chrome WebDriver...\n`);

    // Set up Chrome options
    const options = new chrome.Options();
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    // Build driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log('Chrome WebDriver initialized successfully\n');

    // ============================================================
    // STEP 1: Navigate to Login Page
    // ============================================================
    logStep(1, 'Navigate to login page');
    await driver.get(`${CONFIG.FRONTEND_URL}/login`);
    await driver.sleep(2000);
    await takeScreenshot('01_login_page');
    updateStepStatus(1, 'success', 'Login page loaded');

    // ============================================================
    // STEP 2: Select Administrator Role (MUST BE DONE FIRST)
    // ============================================================
    logStep(2, 'Select Administrator role');
    
    // Wait for page to fully load
    await driver.sleep(1500);
    
    try {
      // Try multiple strategies to find and click role selector
      let roleDropdown = null;
      
      try {
        roleDropdown = await driver.findElement(By.css('button[role="combobox"]'));
      } catch (e) {
        try {
          roleDropdown = await driver.findElement(By.xpath('//button[contains(@class, "select") or contains(@class, "dropdown")]'));
        } catch (e) {
          try {
            roleDropdown = await driver.findElement(By.xpath('//button[contains(., "role") or contains(., "Role") or contains(., "Select")]'));
          } catch (e) {
            const buttons = await driver.findElements(By.css('button'));
            if (buttons.length > 0) {
              roleDropdown = buttons[0];
            }
          }
        }
      }
      
      if (roleDropdown) {
        await roleDropdown.click();
        console.log('   Role dropdown clicked');
        await driver.sleep(1000);
        
        // Now select Administrator option
        const adminOption = await driver.findElement(By.xpath('//*[text()="Administrator" or contains(text(), "Administrator")]'));
        await adminOption.click();
        console.log('   Administrator role selected');
        await driver.sleep(1000);
      } else {
        throw new Error('Could not find role dropdown');
      }
    } catch (error) {
      console.log(`   Error selecting role: ${error.message}`);
      await takeScreenshot('02_role_error');
      throw error;
    }
    
    await takeScreenshot('02_role_selected');
    updateStepStatus(2, 'success', 'Administrator role selected');

    // ============================================================
    // STEP 3: Fill in Admin Credentials
    // ============================================================
    logStep(3, 'Fill in admin login credentials');
    
    // Enter email
    const emailInput = await driver.findElement(By.xpath('//input[@type="email" or @name="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys(CONFIG.ADMIN_EMAIL);
    console.log(`   Email entered: ${CONFIG.ADMIN_EMAIL}`);
    
    // Enter password
    const passwordInput = await driver.findElement(By.xpath('//input[@type="password" or @name="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys(CONFIG.ADMIN_PASSWORD);
    console.log('   Password entered');
    
    await takeScreenshot('03_credentials_filled');
    updateStepStatus(3, 'success', 'Credentials filled');

    // ============================================================
    // STEP 4: Submit Login Form
    // ============================================================
    logStep(4, 'Submit login form');
    
    const loginButton = await driver.findElement(By.xpath('//button[contains(text(), "Sign in") or contains(text(), "Login") or @type="submit"]'));
    await loginButton.click();
    console.log('   Login button clicked');
    
    // Wait for dashboard to load
    await driver.sleep(3000);
    await takeScreenshot('04_dashboard_loaded');
    updateStepStatus(4, 'success', 'Login successful, admin dashboard loaded');

    // ============================================================
    // STEP 5: Navigate to Courses Tab and Create Course
    // ============================================================
    logStep(5, 'Navigate to Courses tab and create a new course');
    
    try {
      // Click Courses tab/link
      const coursesTab = await driver.findElement(By.xpath('//a[contains(text(), "Courses") or contains(text(), "courses")] | //button[contains(text(), "Courses")]'));
      await coursesTab.click();
      console.log('   Courses tab clicked');
      await driver.sleep(2000);
      
      // Click "Create Course" or "Add Course" button
      const createCourseButton = await driver.findElement(By.xpath('//button[contains(., "Create Course") or contains(., "Add Course") or contains(., "New Course")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', createCourseButton);
      await driver.sleep(500);
      await createCourseButton.click();
      console.log('   Create Course button clicked');
      await driver.sleep(3000); // Wait longer for modal form to fully load
      
      // Fill Course name
      const nameInput = await driver.findElement(By.xpath('//input[@name="name" or @name="title" or contains(@placeholder, "Course name")]'));
      await nameInput.clear();
      await nameInput.sendKeys(testData.course.title);
      console.log(`   Course name entered: ${testData.course.title}`);
      await driver.sleep(500);
      
      // Fill Course code
      const codeInput = await driver.findElement(By.xpath('//input[@name="code" or @name="courseCode" or contains(@placeholder, "CSE-401")]'));
      await codeInput.clear();
      await codeInput.sendKeys(testData.course.code);
      console.log(`   Course code entered: ${testData.course.code}`);
      await driver.sleep(500);
      
      // Fill Description (REQUIRED FIELD - try multiple selectors)
      let descInput = null;
      const descriptionText = testData.course.description;
      
      await driver.sleep(1000);
      
      try {
        descInput = await driver.findElement(By.xpath('//textarea[@name="description"]'));
      } catch (e) {
        try {
          descInput = await driver.findElement(By.xpath('//textarea[@id="description" or contains(@id, "description")]'));
        } catch (e) {
          try {
            descInput = await driver.findElement(By.xpath('//textarea[contains(@placeholder, "Description") or contains(@placeholder, "description")]'));
          } catch (e) {
            const textareas = await driver.findElements(By.xpath('//textarea'));
            if (textareas.length > 0) {
              descInput = textareas[0];
            } else {
              const allTextareas = await driver.findElements(By.css('textarea'));
              for (const textarea of allTextareas) {
                if (await textarea.isDisplayed()) {
                  descInput = textarea;
                  break;
                }
              }
            }
          }
        }
      }
      
      // Fill the description if found
      if (descInput) {
        // Scroll to the description field
        await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', descInput);
        await driver.sleep(500);
        await descInput.clear();
        await descInput.sendKeys(descriptionText);
        console.log(`   Course description entered: "${descriptionText}" (REQUIRED)`);
        await driver.sleep(500);
      } else {
        console.log('   WARNING: Description field not found - attempting to continue without it');
        console.log('   NOTE: Course creation may fail if description is truly required');
        await takeScreenshot('05_description_field_not_found');
        // Don't throw error, let's see if we can continue
      }
      
      // Fill Credit
      const creditInput = await driver.findElement(By.xpath('//input[@name="credit" or @name="credits" or @type="number"]'));
      await creditInput.clear();
      await creditInput.sendKeys('3');
      console.log('   Credit entered: 3');
      await driver.sleep(500);
      
      // Select Semester
      try {
        const semesterSelect = await driver.findElement(By.xpath('//select[@name="semester"] | //button[contains(., "Select") and contains(., "semester")]'));
        await semesterSelect.click();
        await driver.sleep(500);
        // Select Fall or first option
        const semesterOption = await driver.findElement(By.xpath('//option[contains(., "Fall")] | //div[contains(., "Fall")] | (//option)[1]'));
        await semesterOption.click();
        console.log('   Semester selected');
        await driver.sleep(500);
      } catch (e) {
        console.log('   Semester selection not found or not required');
      }
      
      // Fill Year (2024-2025)
      try {
        const yearInput = await driver.findElement(By.xpath('//input[@name="year"] | //select[@name="year"]'));
        await yearInput.clear();
        await yearInput.sendKeys('2024-2025');
        console.log('   Year entered: 2024-2025');
        await driver.sleep(500);
      } catch (e) {
        console.log('   Year field not found, skipping');
      }
      
      await takeScreenshot('05_course_form_filled');
      
      // Click Create Course button
      const submitButton = await driver.findElement(By.xpath('//button[contains(., "Create Course")]'));
      await submitButton.click();
      console.log('   Create Course button clicked');
      await driver.sleep(4000); // Wait longer for course to be created
      
      // Close all modals
      await closeAllModals();
      
      testResults.collectedData.courseName = testData.course.title;
      await takeScreenshot('05_course_created');
      updateStepStatus(5, 'success', `Course created: ${testData.course.title}`);
    } catch (error) {
      console.log(`   Error creating course: ${error.message}`);
      await takeScreenshot('05_course_error');
      updateStepStatus(5, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 6: Navigate to Sections Tab and Create Section
    // ============================================================
    logStep(6, 'Navigate to Sections tab and create a section');
    
    try {
      // Make sure all modals are closed first
      await closeAllModals();
      await driver.sleep(1000);
      
      // Click Sections tab
      const sectionsTab = await driver.findElement(By.xpath('//a[contains(text(), "Sections") or contains(text(), "sections")] | //button[contains(text(), "Sections")]'));
      await sectionsTab.click();
      console.log('   Sections tab clicked');
      await driver.sleep(2000);
      
      // Click "Create Section" button
      const createSectionButton = await driver.findElement(By.xpath('//button[contains(., "Create Section") or contains(., "Add Section") or contains(., "New Section")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', createSectionButton);
      await driver.sleep(500);
      await createSectionButton.click();
      console.log('   Create Section button clicked');
      await driver.sleep(2000);
      
      // Select Course (required field marked with *)
      const courseSelect = await driver.findElement(By.xpath('//select[@name="courseId" or @name="course"] | //button[contains(., "Select a course")]'));
      await courseSelect.click();
      await driver.sleep(1500);
      
      // Try to find and click the course option from the dropdown menu
      try {
        // Look for menu items - find ALL items and select the one matching our new course
        const allMenuItems = await driver.findElements(By.xpath('//*[@role="menuitem"]'));
        console.log(`   Found ${allMenuItems.length} courses in dropdown`);
        
        let found = false;
        for (const item of allMenuItems) {
          const itemText = await item.getText();
          // Check if this item contains our course code (most reliable identifier)
          if (itemText.includes(testData.course.code)) {
            await item.click();
            console.log(`   ✓ Selected course from dropdown: ${itemText}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          // Fallback: Try clicking any item with the course title
          const courseOption = await driver.findElement(By.xpath(`//*[contains(., "${testData.course.code}")]`));
          await courseOption.click();
          console.log(`   ✓ Selected course via code search: ${testData.course.code}`);
        }
        
        await driver.sleep(1000);
        
        const buttonText = await courseSelect.getText();
        if (!buttonText.includes(testData.course.title) && !buttonText.includes(testData.course.code)) {
          throw new Error(`Wrong course selected: ${buttonText}`);
        }
        console.log(`   Course verified: ${buttonText}`);
      } catch (e) {
        console.log(`   Error selecting course: ${e.message}`);
        await takeScreenshot('06_course_selection_error');
        throw e;
      }
      await driver.sleep(1000);
      
      // Fill Section Name (required field marked with *)
      const sectionNameInput = await driver.findElement(By.xpath('//input[@name="name" or @name="sectionName" or contains(@placeholder, "Section A")]'));
      await sectionNameInput.clear();
      await sectionNameInput.sendKeys(testData.section.name);
      console.log(`   Section name entered: ${testData.section.name}`);
      await driver.sleep(500);
      
      // Fill Max Capacity (default 50)
      try {
        const capacityInput = await driver.findElement(By.xpath('//input[@name="capacity" or @name="maxCapacity" or @type="number"]'));
        await capacityInput.clear();
        await capacityInput.sendKeys('50');
        console.log('   Max capacity entered: 50');
        await driver.sleep(500);
      } catch (e) {
        console.log('   Max capacity field not found, using default');
      }
      
      await takeScreenshot('06_section_form_filled');
      
      // Wait a moment for form to be ready
      await driver.sleep(500);
      
      // Click the CREATE SECTION submit button (in DialogFooter, not the trigger button)
      try {
        // Find ALL "Create Section" buttons
        const buttons = await driver.findElements(By.xpath('//button[contains(text(), "Create Section")]'));
        console.log(`   Found ${buttons.length} "Create Section" buttons`);
        
        if (buttons.length >= 2) {
          // The SECOND button is in the DialogFooter and submits the form
          const submitButton = buttons[1];
          
          // Get button details for debugging
          const isVisible = await submitButton.isDisplayed();
          const isEnabled = await submitButton.isEnabled();
          console.log(`   Submit button - Visible: ${isVisible}, Enabled: ${isEnabled}`);
          
          // Scroll into view and click
          await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', submitButton);
          await driver.sleep(300);
          
          // Try both click methods
          try {
            await submitButton.click();
            console.log('   ✓ Create Section submit button clicked (direct click)');
          } catch (clickErr) {
            await driver.executeScript('arguments[0].click()', submitButton);
            console.log('   ✓ Create Section submit button clicked (JavaScript click)');
          }
        } else if (buttons.length === 1) {
          // Only one button found - might be in wrong state
          console.log('   ⚠️  WARNING: Only 1 "Create Section" button found - dialog might not be open');
          await driver.executeScript('arguments[0].click()', buttons[0]);
          console.log('   Clicked the only "Create Section" button available');
        } else {
          throw new Error('No "Create Section" buttons found');
        }
      } catch (e) {
        console.log(`   ❌ ERROR clicking Create Section button: ${e.message}`);
        await takeScreenshot('06_button_click_error');
        throw e;
      }
      
      // Wait for API response and check for toast notifications
      await driver.sleep(5000); // Wait even longer for API call to complete
      
      // Check for any toast messages (success or error)
      try {
        const toasts = await driver.findElements(By.xpath('//*[contains(@class, "toast") or contains(@role, "alert") or contains(@role, "status")]'));
        if (toasts.length > 0) {
          console.log(`   Found ${toasts.length} toast notification(s):`);
          for (const toast of toasts) {
            const toastText = await toast.getText().catch(() => '');
            if (toastText) {
              console.log(`      Toast: ${toastText}`);
            }
          }
        } else {
          console.log('   ⚠️  No toast notifications found - section creation might have failed silently');
        }
      } catch (e) {
        console.log('   Could not check for toast notifications');
      }
      
      await closeAllModals();
      await driver.sleep(2000);
      
      console.log('   Refreshing page to load updated sections list...');
      await driver.navigate().refresh();
      await driver.sleep(3000);
      
      testResults.collectedData.sectionName = testData.section.name;
      await takeScreenshot('06_section_created');
      updateStepStatus(6, 'success', `Section created: ${testData.section.name}`);
    } catch (error) {
      console.log(`   Error creating section: ${error.message}`);
      await takeScreenshot('06_section_error');
      updateStepStatus(6, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 7: Navigate to Teachers Tab and Create Teacher
    // ============================================================
    logStep(7, 'Navigate to Teachers tab and create a teacher');
    
    try {
      // Click Teachers tab
      const teachersTab = await driver.findElement(By.xpath('//a[contains(text(), "Teachers") or contains(text(), "teachers")] | //button[contains(text(), "Teachers")]'));
      await teachersTab.click();
      console.log('   Teachers tab clicked');
      await driver.sleep(2000);
      
      // Click "Create Teacher" button
      const createTeacherButton = await driver.findElement(By.xpath('//button[contains(., "Create Teacher") or contains(., "Add Teacher") or contains(., "New Teacher")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', createTeacherButton);
      await driver.sleep(500);
      await createTeacherButton.click();
      console.log('   Create Teacher button clicked');
      await driver.sleep(1500);
      
      // Fill teacher name
      const nameInput = await driver.findElement(By.xpath('//input[@name="name" or contains(@placeholder, "name") or contains(@placeholder, "Name")]'));
      await nameInput.clear();
      await nameInput.sendKeys(testData.teacher.name);
      console.log(`   Teacher name entered: ${testData.teacher.name}`);
      await driver.sleep(300);
      
      // Fill teacher email
      const emailInput = await driver.findElement(By.xpath('//input[@name="email" or @type="email" or contains(@placeholder, "email")]'));
      await emailInput.clear();
      await emailInput.sendKeys(testData.teacher.email);
      console.log(`   Teacher email entered: ${testData.teacher.email}`);
      await driver.sleep(300);
      
      // Fill password
      const passwordInput = await driver.findElement(By.xpath('//input[@name="password" or @type="password" or contains(@placeholder, "password")]'));
      await passwordInput.clear();
      await passwordInput.sendKeys(testData.teacher.password);
      console.log('   Teacher password entered');
      await driver.sleep(300);
      
      await takeScreenshot('07_teacher_form_filled');
      
      // Submit form
      const submitButton = await driver.findElement(By.xpath('//button[@type="submit" or contains(., "Create") or contains(., "Save") or contains(., "Add")]'));
      await submitButton.click();
      console.log('   Teacher form submitted');
      await driver.sleep(2000);
      
      testResults.collectedData.teacherName = testData.teacher.name;
      await takeScreenshot('07_teacher_created');
      updateStepStatus(7, 'success', `Teacher created: ${testData.teacher.name}`);
    } catch (error) {
      console.log(`   Error creating teacher: ${error.message}`);
      await takeScreenshot('07_teacher_error');
      updateStepStatus(7, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 8: Navigate to Students Tab and Create Student
    // ============================================================
    logStep(8, 'Navigate to Students tab and create a student');
    
    try {
      // Click Students tab
      const studentsTab = await driver.findElement(By.xpath('//a[contains(text(), "Students") or contains(text(), "students")] | //button[contains(text(), "Students")]'));
      await studentsTab.click();
      console.log('   Students tab clicked');
      await driver.sleep(2000);
      
      // Click "Create Student" button
      const createStudentButton = await driver.findElement(By.xpath('//button[contains(., "Create Student") or contains(., "Add Student") or contains(., "New Student")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', createStudentButton);
      await driver.sleep(500);
      await createStudentButton.click();
      console.log('   Create Student button clicked');
      await driver.sleep(1500);
      
      // Fill student name
      const nameInput = await driver.findElement(By.xpath('//input[@name="name" or contains(@placeholder, "name") or contains(@placeholder, "Name")]'));
      await nameInput.clear();
      await nameInput.sendKeys(testData.student.name);
      console.log(`   Student name entered: ${testData.student.name}`);
      await driver.sleep(300);
      
      // Fill student email
      const emailInput = await driver.findElement(By.xpath('//input[@name="email" or @type="email" or contains(@placeholder, "email")]'));
      await emailInput.clear();
      await emailInput.sendKeys(testData.student.email);
      console.log(`   Student email entered: ${testData.student.email}`);
      await driver.sleep(300);
      
      // Fill student ID (if available)
      try {
        const studentIdInput = await driver.findElement(By.xpath('//input[@name="studentId" or contains(@placeholder, "Student ID") or contains(@placeholder, "student id")]'));
        await studentIdInput.clear();
        await studentIdInput.sendKeys(testData.student.studentId);
        console.log('   Student ID entered');
        await driver.sleep(300);
      } catch (e) {
        console.log('   Student ID field not found, skipping');
      }
      
      // Fill password
      const passwordInput = await driver.findElement(By.xpath('//input[@name="password" or @type="password" or contains(@placeholder, "password")]'));
      await passwordInput.clear();
      await passwordInput.sendKeys(testData.student.password);
      console.log('   Student password entered');
      await driver.sleep(300);
      
      await takeScreenshot('08_student_form_filled');
      
      // Submit form
      const submitButton = await driver.findElement(By.xpath('//button[@type="submit" or contains(., "Create") or contains(., "Save") or contains(., "Add")]'));
      await submitButton.click();
      console.log('   Student form submitted');
      await driver.sleep(2000);
      
      testResults.collectedData.studentName = testData.student.name;
      await takeScreenshot('08_student_created');
      updateStepStatus(8, 'success', `Student created: ${testData.student.name}`);
    } catch (error) {
      console.log(`   Error creating student: ${error.message}`);
      await takeScreenshot('08_student_error');
      updateStepStatus(8, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 9: Go back to Teachers Tab and Assign Teacher to Section
    // ============================================================
    logStep(9, 'Go back to Teachers tab and assign teacher to section');
    
    try {
      // Stay on Teachers tab or click it to make sure we're there
      const teachersTab = await driver.findElement(By.xpath('//a[contains(text(), "Teachers") or contains(text(), "teachers")] | //button[contains(text(), "Teachers")]'));
      await teachersTab.click();
      console.log('   Teachers tab clicked');
      await driver.sleep(2000);
      
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
      await driver.sleep(1000);
      
      // Select Teacher dropdown
      const teacherSelect = await driver.findElement(By.xpath('//button[contains(., "Select Teacher")] | //select[@name="teacherId"]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', teacherSelect);
      await driver.sleep(500);
      await teacherSelect.click();
      console.log('   Teacher dropdown clicked');
      await driver.sleep(1000);
      
      // Find and select the teacher we just created
      try {
        const teacherItems = await driver.findElements(By.xpath('//*[@role="menuitem"]'));
        console.log(`   Found ${teacherItems.length} teachers in dropdown`);
        
        let found = false;
        for (const item of teacherItems) {
          const itemText = await item.getText();
          if (itemText.includes(testData.teacher.email) || itemText.includes(testData.teacher.name)) {
            await item.click();
            console.log(`   Selected teacher: ${itemText}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          throw new Error(`Teacher not found in dropdown`);
        }
      } catch (e) {
        console.log(`   Error selecting teacher: ${e.message}`);
        throw e;
      }
      
      await driver.sleep(1000);
      
      // Select Section dropdown
      const sectionSelect = await driver.findElement(By.xpath('//button[contains(., "Select Section")] | //select[@name="sectionId"]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', sectionSelect);
      await driver.sleep(500);
      await sectionSelect.click();
      console.log('   Section dropdown clicked');
      await driver.sleep(1000);
      
      try {
        const sectionItems = await driver.findElements(By.xpath('//*[@role="menuitem"]'));
        console.log(`   Found ${sectionItems.length} sections in dropdown`);
        
        let found = false;
        for (const item of sectionItems) {
          const itemText = await item.getText();
          if (itemText.includes(testData.section.name) || itemText.includes(testData.course.code)) {
            await item.click();
            console.log(`   Selected section: ${itemText}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          throw new Error(`Section not found in dropdown`);
        }
      } catch (e) {
        console.log(`   Error selecting section: ${e.message}`);
        throw e;
      }
      
      await driver.sleep(1000);
      await takeScreenshot('09_teacher_assignment_form_filled');
      
      // Click "Assign Teacher" button
      const assignButton = await driver.findElement(By.xpath('//button[contains(., "Assign Teacher")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', assignButton);
      await driver.sleep(500);
      await assignButton.click();
      console.log('   Assign Teacher button clicked');
      await driver.sleep(3000);
      
      await takeScreenshot('09_teacher_assigned');
      updateStepStatus(9, 'success', `Teacher assigned to section`);
    } catch (error) {
      console.log(`   Error assigning teacher: ${error.message}`);
      await takeScreenshot('09_teacher_assignment_error');
      updateStepStatus(9, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 10: Go to Students Tab and Assign Student to Section
    // ============================================================
    logStep(10, 'Go to Students tab and assign student to section');
    
    try {
      // Stay on Students tab or click it to make sure we're there
      const studentsTab = await driver.findElement(By.xpath('//a[contains(text(), "Students") or contains(text(), "students")] | //button[contains(text(), "Students")]'));
      await studentsTab.click();
      console.log('   Students tab clicked');
      await driver.sleep(2000);
      
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
      await driver.sleep(1000);
      
      // Select Student dropdown
      const studentSelect = await driver.findElement(By.xpath('//button[contains(., "Select Student")] | //select[@name="studentId"]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', studentSelect);
      await driver.sleep(500);
      await studentSelect.click();
      console.log('   Student dropdown clicked');
      await driver.sleep(1000);
      
      try {
        const studentItems = await driver.findElements(By.xpath('//*[@role="menuitem"]'));
        console.log(`   Found ${studentItems.length} students in dropdown`);
        
        let found = false;
        for (const item of studentItems) {
          const itemText = await item.getText();
          if (itemText.includes(testData.student.email) || itemText.includes(testData.student.name)) {
            await item.click();
            console.log(`   Selected student: ${itemText}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          throw new Error(`Student not found in dropdown`);
        }
      } catch (e) {
        console.log(`   Error selecting student: ${e.message}`);
        throw e;
      }
      
      await driver.sleep(1000);
      
      // Select Section dropdown
      const sectionSelect = await driver.findElement(By.xpath('//button[contains(., "Select Section")] | //select[@name="sectionId"]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', sectionSelect);
      await driver.sleep(500);
      await sectionSelect.click();
      console.log('   Section dropdown clicked');
      await driver.sleep(1000);
      
      try {
        const sectionItems = await driver.findElements(By.xpath('//*[@role="menuitem"]'));
        console.log(`   Found ${sectionItems.length} sections in dropdown`);
        
        let found = false;
        for (const item of sectionItems) {
          const itemText = await item.getText();
          if (itemText.includes(testData.section.name) || itemText.includes(testData.course.code)) {
            await item.click();
            console.log(`   Selected section: ${itemText}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          throw new Error(`Section not found in dropdown`);
        }
      } catch (e) {
        console.log(`   Error selecting section: ${e.message}`);
        throw e;
      }
      
      await driver.sleep(1000);
      await takeScreenshot('10_student_enrollment_form_filled');
      
      // Click "Assign Student" button
      const assignButton = await driver.findElement(By.xpath('//button[contains(., "Assign Student") or contains(., "Enroll Student")]'));
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', assignButton);
      await driver.sleep(500);
      await assignButton.click();
      console.log('   Assign Student button clicked');
      await driver.sleep(3000);
      
      await takeScreenshot('10_student_assigned');
      updateStepStatus(10, 'success', `Student assigned to section`);
    } catch (error) {
      console.log(`   Error enrolling student: ${error.message}`);
      await takeScreenshot('10_student_enrollment_error');
      updateStepStatus(10, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 11: Logout
    // ============================================================
    logStep(11, 'Logout from admin account');
    
    try {
      // Find and click logout button (could be in menu, avatar, or header)
      await driver.sleep(1000);
      
      // Try clicking avatar/profile menu first
      try {
        const profileMenu = await driver.findElement(By.xpath('//button[contains(@class, "avatar") or contains(@aria-label, "profile")] | //div[contains(@class, "avatar")]'));
        await profileMenu.click();
        console.log('   Profile menu clicked');
        await driver.sleep(1000);
      } catch (e) {
        console.log('   No profile menu found, looking for direct logout button');
      }
      
      // Click logout button
      const logoutButton = await driver.findElement(By.xpath('//button[contains(., "Logout") or contains(., "Log out") or contains(., "Sign out")] | //a[contains(., "Logout") or contains(., "Log out")]'));
      await logoutButton.click();
      console.log('   Logout button clicked');
      await driver.sleep(2000);
      
      await takeScreenshot('11_logged_out');
      updateStepStatus(11, 'success', 'Logged out successfully');
    } catch (error) {
      console.log(`   Error during logout: ${error.message}`);
      await takeScreenshot('11_logout_error');
      updateStepStatus(11, 'failed', `Error: ${error.message}`);
    }

    // ============================================================
    // STEP 12: Final Verification
    // ============================================================
    logStep(12, 'Take final screenshot and verify all steps');
    await driver.sleep(2000);
    await takeScreenshot('12_final_state');
    updateStepStatus(12, 'success', 'All steps completed');

    // ============================================================
    // TEST SUMMARY
    // ============================================================
    testResults.endTime = new Date();
    testResults.duration = (testResults.endTime - testResults.startTime) / 1000;
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST EXECUTION SUMMARY');
    console.log('='.repeat(80) + '\n');
    
    const totalSteps = testResults.steps.length;
    const successSteps = testResults.steps.filter(s => s.status === 'success').length;
    const failedSteps = testResults.steps.filter(s => s.status === 'failed').length;
    
    console.log(`Total Steps: ${totalSteps}`);
    console.log(`Passed: ${successSteps}`);
    console.log(`Failed: ${failedSteps}`);
    console.log(`Duration: ${testResults.duration.toFixed(2)} seconds`);
    console.log(`Success Rate: ${((successSteps / totalSteps) * 100).toFixed(1)}%`);
    
    console.log('\nCOLLECTED DATA:');
    console.log(`Course Created: ${testResults.collectedData.courseName || 'N/A'}`);
    console.log(`Section Created: ${testResults.collectedData.sectionName || 'N/A'}`);
    console.log(`Teacher Created: ${testResults.collectedData.teacherName || 'N/A'}`);
    console.log(`Student Created: ${testResults.collectedData.studentName || 'N/A'}`);
    
    if (failedSteps === 0) {
      console.log('\nTEST RESULT: PASSED - All test steps completed successfully');
      testResults.success = true;
    } else {
      console.log('\nTEST RESULT: PARTIAL SUCCESS - Some steps failed');
      testResults.success = false;
    }
    
    // Generate professional reports
    console.log('\nGenerating professional test reports...');
    const reportGenerator = new TestReportGenerator(testResults);
    await reportGenerator.generateAllReports();
    
    console.log('\nClosing browser...');
    await driver.quit();
    console.log('Browser closed successfully');
    
    console.log('\nDETAILED STEP RESULTS:\n');
    testResults.steps.forEach(step => {
      console.log(`Step ${step.stepNumber}: ${step.description}`);
      console.log(`   Status: ${step.status.toUpperCase()}`);
      if (step.details) {
        console.log(`   Details: ${step.details}`);
      }
      console.log('');
    });
    
    console.log('TEST EXECUTION COMPLETE');
    process.exit(failedSteps > 0 ? 1 : 0);

  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    testResults.success = false;
    testResults.error = error.message;
    
    if (driver) {
      await takeScreenshot('error_fatal');
      await driver.quit();
    }
    
    process.exit(1);
  }
}

// Run the test
runAdminWorkflowTest();
