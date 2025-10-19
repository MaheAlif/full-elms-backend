# Selenium Test Fixes - October 19, 2025

## Issues Fixed

### 1. Assignment Detection Not Working ✓
**Problem:** CSE-4101 has 1 assignment but test was finding 0 assignments.

**Root Cause:** The test was looking for ALL glassmorphic cards which included material cards, and the filtering logic wasn't precise enough.

**Solution Implemented:**
- Added better scrolling to ensure assignments section is visible
- Improved XPath selector to look for cards with assignment-specific keywords: "Due", "due", "Assignment", "Points"
- Added fallback strategy to manually filter cards after the assignments heading
- Added better skip logic to avoid material cards (cards with "Download" but no "Due")
- Added detailed logging showing what text is in each card
- Increased wait times to ensure DOM is fully loaded

**Code Changes:**
```javascript
// Scroll down first
await driver.executeScript('window.scrollTo(0, document.body.scrollHeight / 2)');
await driver.sleep(1500);

// Better heading detection
const assignmentsSection = await driver.findElements(By.xpath('//h2[contains(text(), "Assignments")] | //h3[contains(text(), "Assignments")] | //div[contains(@class, "heading") and contains(., "Assignments")]'));

// Multiple strategies for finding assignment cards
let assignmentCards = await driver.findElements(By.xpath('//div[contains(@class, "glassmorphic") and (contains(., "Due") or contains(., "due") or contains(., "Assignment") or contains(., "Points") or contains(., "points"))]'));

// Fallback: manually filter all cards
if (assignmentCards.length === 0) {
  // Check each card for assignment indicators
  if ((cardText.includes('Due') || cardText.includes('Submit') || cardText.includes('Assignment')) 
      && !cardText.includes('Download')) {
    assignmentCards.push(card);
  }
}

// Better filtering during processing
if (cardText.includes('Download') && !cardText.includes('Due') && !cardText.includes('due')) {
  console.log(`   Skipping material card`);
  continue;
}
```

---

### 2. October 30, 2025 Events Not Detected ✓
**Problem:** Events exist on October 30, 2025 but appear only on hover. Test was clicking but not hovering.

**Root Cause:** The test was trying to click the date directly, but the UI shows events in a hover tooltip/popup that appears when you hover over the date.

**Solution Implemented:**
- Added hover action using Selenium Actions API
- Hover over October 30 date button before looking for events
- Increased wait time after hover to allow tooltip/popup to appear
- Look for tooltip, popover, and event elements
- Filter only visible (displayed) elements
- Also click after hover to check for additional events that might appear on click

**Code Changes:**
```javascript
// HOVER over the date to see events (events appear on hover)
const actions = driver.actions({async: true});
await actions.move({origin: dateBtn}).perform();
console.log('   Hovering over October 30, 2025 to reveal events');
await driver.sleep(1500); // Wait for hover tooltip/popup to appear

// Now look for event elements that appeared on hover
const eventElements = await driver.findElements(By.xpath('//div[contains(@class, "tooltip") or contains(@class, "popover") or contains(@class, "event") or contains(@class, "Event")]'));

// Only collect visible events
const isDisplayed = await eventElements[i].isDisplayed();
if (!isDisplayed) continue;

// Also try clicking to see if more events appear
await driver.executeScript('arguments[0].click()', dateBtn);
await driver.sleep(1000);
console.log('   Also clicked October 30 to check for additional events');
```

---

### 3. Class Chat Message Not Sending ✓
**Problem:** Chat input element not found, so message couldn't be sent.

**Root Cause:** Multiple issues:
- Not enough wait time for chat panel to fully load
- Input selectors weren't comprehensive enough
- Message was too long (now changed to "test")

**Solution Implemented:**
- Increased wait time after clicking Class Chat tab (2s → 3s)
- Added textarea detection as first strategy (many chats use textarea)
- Added case-insensitive placeholder search
- Improved visibility checking for inputs
- Changed message from long sentence to simple "test"
- Added better error handling and logging

**Code Changes:**
```javascript
// Increased wait time
await driver.sleep(3000); // Increased from 2000

// Strategy 1: Look for textarea first
chatInput = await driver.findElement(By.css('textarea[placeholder*="message" i], textarea[placeholder*="type" i]'));

// Strategy 2: Case-insensitive XPath
chatInput = await driver.findElement(By.xpath('//input[contains(translate(@placeholder, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "message")]'));

// Changed message
const chatMessage = "test"; // Was: "Hello everyone! Looking forward to learning more in this course!"
```

---

### 4. Removed AI Chat References ✓
**Problem:** Header comment still mentioned "AI chat and interact" even though that step was removed.

**Solution:** Updated the header comment to accurately reflect the current 6 main workflow steps (excluding setup steps).

**Code Changes:**
```javascript
/**
 * This test automates a complete student user workflow:
 * 1. Login as student
 * 2. Select a course
 * 3. Download materials from that course
 * 4. View assignments and check submission status
 * 5. Select calendar and check for events on October 30, 2025
 * 6. Go to class chat and send a message
 */
```

---

## Test Steps Summary

### Current 10-Step Test Flow:
1. **Navigate to Login Page** - Opens http://localhost:3000/login
2. **Fill Credentials** - Enters email and password
3. **Select Student Role** - Confirms student role (default)
4. **Submit Login** - Clicks login button and waits for dashboard
5. **Select Course** - Selects CSE-4101 course
6. **Download Materials** - Downloads first available material
7. **Check Assignments** - Views assignments and detects submission status
8. **Calendar Events** - Hovers over October 30, 2025 to see events
9. **Class Chat** - Sends "test" message in class chat
10. **Final Verification** - Takes final screenshot

---

## Expected Results After Fixes

### Assignment Detection:
✓ Should now detect the 1 assignment in CSE-4101 course
✓ Should correctly identify if it's submitted or not
✓ Output: `Assignment: [Name] - [Submitted/Not Submitted/Unknown]`

### Calendar Events:
✓ Should detect events on October 30, 2025 via hover
✓ Should collect event titles and details
✓ Output: `Event 1: [Event Title]`

### Class Chat:
✓ Should successfully find chat input (textarea or input)
✓ Should send "test" message
✓ Output: `Message typed: "test"`
✓ Output: `Class chat message sent successfully`

---

## Running the Test

```bash
cd c:\xampp\htdocs\full-elms-backend\tests
node selenium-student-full-workflow.js
```

### Expected Success Rate:
**100% (10/10 steps)** if all fixes work correctly

### Expected Duration:
**~60-80 seconds** (slightly longer due to hover actions and increased wait times)

---

## Technical Improvements

### Better Element Detection:
- Multiple fallback strategies for each element type
- Case-insensitive searches
- Visibility checking before interaction
- Better XPath expressions

### Improved Timing:
- Strategic wait times after tab clicks
- Hover action delays for tooltips
- Scroll completion waits

### Enhanced Logging:
- Shows card text snippets for debugging
- Logs each strategy attempt
- Shows why cards are skipped

### Robust Error Handling:
- Try-catch blocks with specific error messages
- Graceful fallbacks when elements not found
- Detailed console output for troubleshooting

---

## Files Modified

1. **selenium-student-full-workflow.js**
   - Step 7: Assignment detection logic (lines ~335-430)
   - Step 8: Calendar hover action (lines ~445-530)
   - Step 9: Chat input detection and message (lines ~545-640)
   - Header comment (lines 1-20)

---

## Next Steps

1. Run the test to verify all fixes work
2. Check test reports for success rate
3. If issues persist:
   - Check browser console for JavaScript errors
   - Inspect actual HTML structure of problematic elements
   - Add data-testid attributes to UI components for reliable selection

---

*Fixes implemented: October 19, 2025*
