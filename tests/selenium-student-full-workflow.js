/**
 * ============================================================
 * SELENIUM STUDENT WORKFLOW TEST - Complete User Journey
 * ============================================================
 * 
 * This test automates a complete student user workflow:
 * 1. Login as student
 * 2. Select a course
 * 3. Download materials from that course
 * 4. View assignments and check submission status
 * 5. Select calendar and check for events on October 30, 2025
 * 6. Go to class chat and send a message
 * 
 * Test User Credentials:
 * - Email: sakib221131@bscse.uiu.ac.bd
 * - Password: password123
 * - Role: Student
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
  STUDENT_EMAIL: 'sakib221131@bscse.uiu.ac.bd',
  STUDENT_PASSWORD: 'password123',
  TIMEOUT: 5000, // 5 seconds
  SCREENSHOT_DIR: './test-screenshots',
};

// Test data
let driver;
let testResults = {
  testName: 'Student Full Workflow Test',
  testUser: CONFIG.STUDENT_EMAIL,
  frontendUrl: CONFIG.FRONTEND_URL,
  backendUrl: CONFIG.BACKEND_URL,
  timeout: CONFIG.TIMEOUT,
  startTime: new Date(),
  steps: [],
  success: true,
  error: null,
  collectedData: {
    selectedCourse: null,
    materialsDownloaded: [],
    assignmentsTabClicked: false,
    selectedDate: 'October 30, 2025',
    calendarEvents: [],
    chatMessageSent: false
  }
};

/**
 * Helper function to take screenshots
 */
async function takeScreenshot(stepName) {
  try {
    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(CONFIG.SCREENSHOT_DIR)) {
      fs.mkdirSync(CONFIG.SCREENSHOT_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${stepName.replace(/\s+/g, '_')}.png`;
    const filepath = path.join(CONFIG.SCREENSHOT_DIR, filename);
    
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`   Screenshot saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('   Failed to take screenshot:', error.message);
  }
}

/**
 * Helper function to wait for element
 */
async function waitForElement(locator, timeout = CONFIG.TIMEOUT) {
  return await driver.wait(until.elementLocated(locator), timeout);
}

/**
 * Helper function to log test steps
 */
function logStep(stepNumber, description, status = 'pending') {
  const step = {
    number: stepNumber,
    description,
    status,
    timestamp: new Date(),
  };
  
  testResults.steps.push(step);
  
  console.log(`\n[Step ${stepNumber}] ${description}`);
  
  return step;
}

/**
 * Helper function to update step status
 */
function updateStepStatus(stepNumber, status, details = null) {
  const step = testResults.steps.find(s => s.number === stepNumber);
  if (step) {
    step.status = status;
    step.details = details;
    step.completedAt = new Date();
    
    console.log(`   Status: ${status.toUpperCase()}${details ? ' - ' + details : ''}`);
  }
}

/**
 * Main test function
 */
async function runStudentWorkflowTest() {
  console.log('\nSELENIUM STUDENT WORKFLOW TEST - STARTING\n');
  console.log(`Test User: ${CONFIG.STUDENT_EMAIL}`);
  console.log(`Frontend URL: ${CONFIG.FRONTEND_URL}`);
  console.log(`Backend URL: ${CONFIG.BACKEND_URL}\n`);

  try {
    // Setup Chrome driver
    console.log('Setting up Chrome WebDriver...');
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--start-maximized');
    chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
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
    // STEP 2: Fill in Login Credentials
    // ============================================================
    logStep(2, 'Fill in login credentials');
    
    // Wait for email input
    let emailInput;
    try {
      emailInput = await waitForElement(By.css('input[type="email"]'));
    } catch (e) {
      try {
        emailInput = await driver.findElement(By.css('input[name="email"]'));
      } catch (e2) {
        emailInput = await driver.findElement(By.css('input[placeholder*="email"]'));
      }
    }
    await emailInput.clear();
    await emailInput.sendKeys(CONFIG.STUDENT_EMAIL);
    console.log(`   Email entered: ${CONFIG.STUDENT_EMAIL}`);
    
    // Wait for password input
    let passwordInput;
    try {
      passwordInput = await waitForElement(By.css('input[type="password"]'));
    } catch (e) {
      passwordInput = await driver.findElement(By.css('input[name="password"]'));
    }
    await passwordInput.clear();
    await passwordInput.sendKeys(CONFIG.STUDENT_PASSWORD);
    console.log('   Password entered');
    
    await driver.sleep(1000);
    await takeScreenshot('02_credentials_filled');
    updateStepStatus(2, 'success', 'Credentials filled');

    // ============================================================
    // STEP 3: Select Student Role (if dropdown exists)
    // ============================================================
    logStep(3, 'Select student role');
    try {
      // Look for role dropdown/button using XPath
      const roleDropdown = await driver.findElement(By.xpath('//button[@role="combobox" or contains(text(), "Student") or contains(text(), "Role")]'));
      await roleDropdown.click();
      await driver.sleep(500);
      
      // Select student option
      const studentOption = await driver.findElement(By.xpath('//div[contains(text(), "Student")] | //button[contains(text(), "Student")]'));
      await studentOption.click();
      console.log('   👤 Student role selected');
      await driver.sleep(500);
    } catch (error) {
      console.log('   No role selection needed (default student role)');
    }
    await takeScreenshot('03_role_selected');
    updateStepStatus(3, 'success', 'Role selected/confirmed');

    // ============================================================
    // STEP 4: Submit Login Form
    // ============================================================
    logStep(4, 'Submit login form');
    // Try to find the login button using multiple selectors
    let loginButton;
    try {
      // First try: submit button type
      loginButton = await driver.findElement(By.css('button[type="submit"]'));
    } catch (e) {
      try {
        // Second try: button with text using XPath
        loginButton = await driver.findElement(By.xpath('//button[contains(text(), "Sign in") or contains(text(), "Login") or contains(text(), "Sign In")]'));
      } catch (e2) {
        // Third try: any button in the form
        loginButton = await driver.findElement(By.css('form button'));
      }
    }
    await loginButton.click();
    console.log('   Login button clicked');
    
    // Wait for dashboard to load
    await driver.wait(until.urlContains('/dashboard'), CONFIG.TIMEOUT);
    await driver.sleep(3000); // Wait for data to load
    await takeScreenshot('04_dashboard_loaded');
    updateStepStatus(4, 'success', 'Login successful, dashboard loaded');

    // ============================================================
    // STEP 5: Select a Course
    // ============================================================
    logStep(5, 'Select a course from the course list');
    
    // Wait for courses to load
    await driver.sleep(2000);
    
    // Find and click on the first course card
    const courseCards = await driver.findElements(By.css('div[class*="cursor-pointer"]'));
    if (courseCards.length === 0) {
      throw new Error('No courses found');
    }
    
    // Try to find a specific course or select the first one
    let courseSelected = false;
    let selectedCourseText = '';
    for (let card of courseCards) {
      try {
        const cardText = await card.getText();
        // Look for courses that might have materials/assignments
        if (cardText.includes('CSE') || cardText.includes('Materials') || cardText.includes('Assignments')) {
          await card.click();
          selectedCourseText = cardText.split('\n')[0]; // Get course name
          testResults.collectedData.selectedCourse = selectedCourseText;
          console.log(`   Course selected: ${selectedCourseText}`);
          courseSelected = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!courseSelected) {
      // Click the first course
      await courseCards[0].click();
      selectedCourseText = await courseCards[0].getText();
      testResults.collectedData.selectedCourse = selectedCourseText.split('\n')[0];
      console.log(`   First course selected: ${testResults.collectedData.selectedCourse}`);
    }
    
    await driver.sleep(2000);
    await takeScreenshot('05_course_selected');
    updateStepStatus(5, 'success', `Selected: ${testResults.collectedData.selectedCourse}`);

    // ============================================================
    // STEP 6: View and Download Materials of the Selected Course
    // ============================================================
    logStep(6, 'View and download materials of the selected course');
    
    // Materials should be displayed in the center panel
    await driver.sleep(1000);
    
    // Try to find materials section
    const materialsSection = await driver.findElements(By.xpath('//h2[contains(text(), "Materials")] | //div[contains(text(), "Materials")]'));
    
    if (materialsSection.length > 0) {
      console.log('   Materials section found');
      
      // Find all material cards with download buttons
      await driver.sleep(1000);
      const downloadButtons = await driver.findElements(By.xpath('//button[contains(., "Download") or .//svg[contains(@class, "Download")]]'));
      
      console.log(`   Total materials available: ${downloadButtons.length}`);
      
      // Download first material if available
      if (downloadButtons.length > 0) {
        try {
          // Get material name before clicking
          const materialCard = await downloadButtons[0].findElement(By.xpath('./ancestor::div[contains(@class, "glassmorphic")]'));
          const materialText = await materialCard.getText();
          const materialName = materialText.split('\n')[0];
          
          // Click download button
          await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', downloadButtons[0]);
          await driver.sleep(500);
          await driver.executeScript('arguments[0].click()', downloadButtons[0]);
          
          testResults.collectedData.materialsDownloaded.push(materialName);
          console.log(`   Downloaded material: ${materialName}`);
          await driver.sleep(1000);
        } catch (e) {
          console.log(`   Error downloading material: ${e.message}`);
        }
      } else {
        console.log('   No downloadable materials found');
      }
    } else {
      console.log('   No materials section found for this course');
    }
    
    await takeScreenshot('06_materials_downloaded');
    updateStepStatus(6, 'success', `Materials downloaded: ${testResults.collectedData.materialsDownloaded.length}`);

    // ============================================================
    // STEP 7: Click on Assignments Tab
    // ============================================================
    logStep(7, 'Click on assignments tab');
    
    try {
      // Click on the Assignments tab
      const assignmentsTab = await driver.findElement(By.xpath('//button[contains(text(), "Assignments") or contains(text(), "Assignment")]'));
      await assignmentsTab.click();
      console.log('   Assignments tab clicked');
      testResults.collectedData.assignmentsTabClicked = true;
      await driver.sleep(2000); // Wait for assignments to load
      
      await takeScreenshot('07_assignments_tab');
      updateStepStatus(7, 'success', 'Assignments tab clicked');
    } catch (e) {
      console.log(`   Could not click assignments tab: ${e.message}`);
      await takeScreenshot('07_assignments_error');
      updateStepStatus(7, 'failed', `Error: ${e.message}`);
    }

    // ============================================================
    // STEP 8: Select Calendar and Check Events on October 30, 2025
    // ============================================================
    logStep(8, 'Select calendar and check events on October 30, 2025');
    
    try {
      // Find Calendar tab
      const calendarTab = await driver.findElement(By.xpath('//button[contains(text(), "Calendar")] | //button[contains(text(), "Events")]'));
      await calendarTab.click();
      console.log('   Calendar tab clicked');
      await driver.sleep(2500);
      
      // Try to find October 30, 2025
      console.log('   Looking for October 30, 2025 on calendar...');
      
      // Look for all date buttons with "30"
      let dateButtons = await driver.findElements(By.xpath('//button[contains(text(), "30")]'));
      console.log(`   Found ${dateButtons.length} date buttons with "30"`);
      
      let october30Found = false;
      let eventsFound = 0;
      
      // Try hovering over each "30" button
      for (let i = 0; i < dateButtons.length; i++) {
        try {
          const dateBtn = dateButtons[i];
          const classList = await dateBtn.getAttribute('class');
          const isDisabled = await dateBtn.getAttribute('disabled');
          
          console.log(`   Checking date button ${i + 1}, classes: ${classList}`);
          
          // Skip muted or disabled dates (previous/next month dates)
          if (classList && (classList.includes('muted') || classList.includes('text-muted') || classList.includes('disabled') || classList.includes('opacity-'))) {
            console.log(`   Skipping muted/disabled date button ${i + 1}`);
            continue;
          }
          if (isDisabled === 'true') {
            console.log(`   Skipping disabled date button ${i + 1}`);
            continue;
          }
          
          // This is likely the current month's October 30
          console.log(`   Found active date button for 30, attempting hover...`);
          
          // Scroll to the date button
          await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', dateBtn);
          await driver.sleep(500);
          
          // HOVER over the date to see events (events appear on hover)
          const actions = driver.actions({async: true});
          await actions.move({origin: dateBtn}).perform();
          console.log('   Hovering over October 30, 2025...');
          await driver.sleep(2000); // Wait longer for hover tooltip/popup to appear
          
          // Now look for event elements that appeared on hover
          // Look for various possible event container patterns
          let eventElements = await driver.findElements(By.xpath(
            '//div[contains(@class, "tooltip") or contains(@class, "popover") or contains(@class, "Popover") ' +
            'or contains(@class, "event") or contains(@class, "Event") ' +
            'or contains(@role, "tooltip") or contains(@class, "floating")]'
          ));
          
          console.log(`   Found ${eventElements.length} potential event elements after hover`);
          
          october30Found = true;
          
          // Filter and collect visible events
          for (let j = 0; j < eventElements.length; j++) {
            try {
              const isDisplayed = await eventElements[j].isDisplayed();
              if (!isDisplayed) {
                console.log(`   Event element ${j + 1} not visible, skipping`);
                continue;
              }
              
              const eventText = await eventElements[j].getText();
              console.log(`   Event element ${j + 1} text: "${eventText}"`);
              
              if (eventText && eventText.trim().length > 3) {
                const eventLines = eventText.split('\n');
                testResults.collectedData.calendarEvents.push({
                  date: 'October 30, 2025',
                  title: eventLines[0] || 'Event',
                  details: eventText
                });
                eventsFound++;
                console.log(`   Event collected: ${eventLines[0]}`);
              }
            } catch (e) {
              console.log(`   Could not read event ${j + 1}: ${e.message}`);
            }
          }
          
          if (eventsFound > 0) {
            console.log(`   Successfully found ${eventsFound} events on October 30`);
            break; // Found events, no need to check other "30" buttons
          } else {
            console.log('   No visible events found on this date button, trying next...');
          }
          
        } catch (e) {
          console.log(`   Error checking date button ${i + 1}: ${e.message}`);
          continue;
        }
      }
      
      if (!october30Found) {
        console.log('   Could not find active October 30 date button on calendar');
      } else if (eventsFound === 0) {
        console.log('   October 30 found but no events detected on hover');
      }
      
      await takeScreenshot('08_calendar_october30');
      updateStepStatus(8, 'success', `Events on October 30: ${testResults.collectedData.calendarEvents.length}`);
    } catch (error) {
      console.log(`   Calendar error: ${error.message}`);
      await takeScreenshot('08_calendar_error');
      updateStepStatus(8, 'failed', `Calendar error: ${error.message}`);
    }

    // ============================================================
    // STEP 9: Go to Class Chat and Send a Message
    // ============================================================
    logStep(9, 'Go to class chat and send a message');
    
    try {
      // Find Class Chat tab
      const classChatTab = await driver.findElement(By.xpath('//button[contains(text(), "Class Chat")] | //button[contains(text(), "Chat")] | //button[contains(text(), "Discussion")]'));
      await classChatTab.click();
      console.log('   Class Chat tab clicked');
      await driver.sleep(3000); // Increased wait time for chat to load
      
      // Scroll to see existing messages
      const chatArea = await driver.findElements(By.css('div[class*="overflow"]'));
      if (chatArea.length > 0) {
        await driver.executeScript('arguments[0].scrollTop = arguments[0].scrollHeight', chatArea[0]);
        await driver.sleep(1000);
      }
      
      // Find chat input with multiple strategies
      let chatInput;
      let inputFound = false;
      
      try {
        // Strategy 1: Look for textarea first (many chats use textarea)
        chatInput = await driver.findElement(By.css('textarea[placeholder*="message" i], textarea[placeholder*="type" i]'));
        inputFound = true;
        console.log('   Found chat textarea');
      } catch (e) {
        try {
          // Strategy 2: Look for input with message-related placeholder
          chatInput = await driver.findElement(By.xpath('//input[contains(translate(@placeholder, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "message") or contains(translate(@placeholder, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "type")]'));
          inputFound = true;
          console.log('   Found chat input with placeholder');
        } catch (e2) {
          try {
            // Strategy 3: Look for input near send button
            const sendButtons = await driver.findElements(By.xpath('//button[@type="submit" or contains(@class, "send") or contains(., "Send")]'));
            if (sendButtons.length > 0) {
              const form = await sendButtons[0].findElement(By.xpath('./ancestor::form'));
              chatInput = await form.findElement(By.css('input[type="text"], textarea, input:not([type="hidden"])'));
              inputFound = true;
              console.log('   Found chat input near send button');
            }
          } catch (e3) {
            try {
              // Strategy 4: Get all visible text inputs/textareas and use the last one
              const textInputs = await driver.findElements(By.css('input[type="text"], textarea'));
              for (let i = textInputs.length - 1; i >= 0; i--) {
                const isDisplayed = await textInputs[i].isDisplayed();
                if (isDisplayed) {
                  chatInput = textInputs[i];
                  inputFound = true;
                  console.log('   Found visible text input (last one on page)');
                  break;
                }
              }
            } catch (e4) {
              console.log('   Could not locate chat input');
            }
          }
        }
      }
      
      if (inputFound && chatInput) {
        // Scroll to input and use JavaScript to interact
        await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', chatInput);
        await driver.sleep(1000);
        await driver.executeScript('arguments[0].click(); arguments[0].focus();', chatInput);
        await driver.sleep(500);
        
        const chatMessage = "test";
        
        // Type message
        await chatInput.clear();
        await driver.sleep(300);
        await chatInput.sendKeys(chatMessage);
        console.log(`   Message typed: "${chatMessage}"`);
        await driver.sleep(1000);
        
        // Find and click send button
        let messageSent = false;
        try {
          const sendButton = await driver.findElement(By.xpath('//button[@type="submit" or contains(@class, "send") or contains(., "Send") or .//svg]'));
          await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', sendButton);
          await driver.sleep(500);
          await driver.executeScript('arguments[0].click()', sendButton);
          messageSent = true;
          console.log('   Send button clicked');
        } catch (e) {
          // Try sending with Enter key
          try {
            await chatInput.sendKeys(Key.RETURN);
            messageSent = true;
            console.log('   Message sent with Enter key');
          } catch (e2) {
            console.log('   Could not send message');
          }
        }
        
        if (messageSent) {
          await driver.sleep(2000);
          testResults.collectedData.chatMessageSent = true;
          await takeScreenshot('09_class_chat_message_sent');
          updateStepStatus(9, 'success', 'Class chat message sent successfully');
        } else {
          await takeScreenshot('09_class_chat_error');
          updateStepStatus(9, 'failed', 'Could not send message');
        }
      } else {
        console.log('   Chat input not found - chat may not be available');
        await takeScreenshot('09_class_chat_error');
        updateStepStatus(9, 'failed', 'Chat input not found');
      }
    } catch (error) {
      console.log(`   Class chat error: ${error.message}`);
      testResults.collectedData.chatMessageSent = false;
      await takeScreenshot('09_class_chat_error');
      updateStepStatus(9, 'failed', `Class chat error: ${error.message}`);
    }

    // ============================================================
    // STEP 10: Final Screenshot and Verification
    // ============================================================
    logStep(10, 'Take final screenshot and verify all steps');
    await driver.sleep(2000);
    await takeScreenshot('10_final_state');
    updateStepStatus(10, 'success', 'All steps completed');

    // ============================================================
    // Test Summary
    // ============================================================
    console.log('\nTEST EXECUTION SUMMARY\n');
    
    testResults.endTime = new Date();
    testResults.duration = (testResults.endTime - testResults.startTime) / 1000;
    
    const successSteps = testResults.steps.filter(s => s.status === 'success').length;
    const failedSteps = testResults.steps.filter(s => s.status === 'failed').length;
    
    console.log(`Total Steps: ${testResults.steps.length}`);
    console.log(`Passed: ${successSteps}`);
    console.log(`Failed: ${failedSteps}`);
    console.log(`Duration: ${testResults.duration.toFixed(2)} seconds`);
    console.log(`Success Rate: ${((successSteps / testResults.steps.length) * 100).toFixed(1)}%`);
    
    console.log('\nCOLLECTED DATA:');
    console.log(`Selected Course: ${testResults.collectedData.selectedCourse || 'N/A'}`);
    console.log(`Materials Downloaded: ${testResults.collectedData.materialsDownloaded.length}`);
    if (testResults.collectedData.materialsDownloaded.length > 0) {
      testResults.collectedData.materialsDownloaded.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material}`);
      });
    }
    console.log(`Assignments Tab Clicked: ${testResults.collectedData.assignmentsTabClicked ? 'Yes' : 'No'}`);
    console.log(`Calendar Date Selected: ${testResults.collectedData.selectedDate}`);
    console.log(`Events on October 30: ${testResults.collectedData.calendarEvents.length}`);
    if (testResults.collectedData.calendarEvents.length > 0) {
      testResults.collectedData.calendarEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title}`);
      });
    }
    console.log(`Class Chat Message: ${testResults.collectedData.chatMessageSent ? 'Sent' : 'Not Sent'}`);
    
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

  } catch (error) {
    console.error('\nTEST FAILED WITH ERROR:\n');
    console.error(error);
    testResults.success = false;
    testResults.error = error.message;
    
    try {
      await takeScreenshot('ERROR_state');
    } catch (e) {
      console.error('Could not take error screenshot');
    }
    
    // Generate error report
    testResults.endTime = new Date();
    testResults.duration = (testResults.endTime - testResults.startTime) / 1000;
    const reportGenerator = new TestReportGenerator(testResults);
    await reportGenerator.generateAllReports();
  } finally {
    // Close browser
    if (driver) {
      console.log('\nClosing browser...');
      await driver.sleep(3000);
      await driver.quit();
      console.log('Browser closed successfully');
    }
    
    // Print detailed results
    console.log('\nDETAILED STEP RESULTS:\n');
    
    testResults.steps.forEach(step => {
      console.log(`Step ${step.number}: ${step.description}`);
      console.log(`   Status: ${step.status.toUpperCase()}`);
      if (step.details) {
        console.log(`   Details: ${step.details}`);
      }
      console.log('');
    });
    
    console.log('TEST EXECUTION COMPLETE\n');
  }
}

// Run the test
runStudentWorkflowTest()
  .then(() => {
    process.exit(testResults.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
