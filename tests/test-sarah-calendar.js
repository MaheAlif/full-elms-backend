/**
 * Test Sarah Johnson's calendar access for Economics
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testSarahCalendar() {
  console.log('📅 Testing Sarah Johnson\'s calendar access...\n');

  try {
    // Login as Sarah Johnson
    console.log('1️⃣ Logging in as Sarah Johnson...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'sarah.johnson@uiu.ac.bd',
      password: 'password123',
      role: 'teacher'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful!\n');

    // Get calendar events
    console.log('2️⃣ Fetching calendar events...');
    const calendarResponse = await axios.get(`${API_BASE}/teacher/calendar`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const events = calendarResponse.data.data.events;
    console.log(`✅ Found ${events.length} calendar events:\n`);

    events.forEach(event => {
      const dateStr = new Date(event.date).toLocaleDateString();
      console.log(`   ${event.type === 'assignment' ? '📝' : '📅'} ${event.title}`);
      console.log(`      Course: ${event.course_name} (${event.course_code})`);
      console.log(`      Date: ${dateStr}`);
      console.log(`      Status: ${event.status}`);
      if (event.type === 'assignment') {
        console.log(`      Submissions: ${event.submission_count}/${event.total_students}`);
      }
      console.log('');
    });

    console.log('🎉 Calendar working perfectly!');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSarahCalendar();
