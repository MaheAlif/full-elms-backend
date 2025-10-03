// Test script for Admin APIs
const API_BASE = 'http://localhost:5000/api';

// Test admin authentication and get system stats
async function testAdminAPIs() {
  try {
    console.log('🔍 Testing Admin APIs...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin.aminul@uiu.ac.bd',
        password: 'password123',
        role: 'admin'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('❌ Admin login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Admin login successful');
    
    const token = loginData.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test system stats (GET /api/admin/stats)
    console.log('\n2. Getting system statistics...');
    const statsResponse = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!statsResponse.ok) {
      const error = await statsResponse.json();
      console.error('❌ Get stats failed:', error);
    } else {
      const statsData = await statsResponse.json();
      console.log('✅ System stats retrieved:');
      console.log(JSON.stringify(statsData, null, 2));
    }

    // Step 3: Test get all courses (GET /api/admin/courses)
    console.log('\n3. Getting all courses...');
    const coursesResponse = await fetch(`${API_BASE}/admin/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!coursesResponse.ok) {
      const error = await coursesResponse.json();
      console.error('❌ Get courses failed:', error);
    } else {
      const coursesData = await coursesResponse.json();
      console.log('✅ Courses retrieved:');
      console.log(`Found ${coursesData.data.courses.length} courses`);
      if (coursesData.data.courses.length > 0) {
        console.log('First course:', coursesData.data.courses[0]);
      }
    }

    // Step 4: Test get all teachers (GET /api/admin/teachers)
    console.log('\n4. Getting all teachers...');
    const teachersResponse = await fetch(`${API_BASE}/admin/teachers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!teachersResponse.ok) {
      const error = await teachersResponse.json();
      console.error('❌ Get teachers failed:', error);
    } else {
      const teachersData = await teachersResponse.json();
      console.log('✅ Teachers retrieved:');
      console.log(`Found ${teachersData.data.teachers.length} teachers`);
      if (teachersData.data.teachers.length > 0) {
        console.log('First teacher:', teachersData.data.teachers[0]);
      }
    }

    // Step 5: Test create course (POST /api/admin/courses)
    console.log('\n5. Testing course creation...');
    const newCourse = {
      course_name: 'Test Admin Course',
      course_code: 'TAC101',
      description: 'A test course created via Admin API',
      credits: 3,
      semester: 'Fall',
      academic_year: '2024-2025'
    };

    const createCourseResponse = await fetch(`${API_BASE}/admin/courses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newCourse)
    });

    if (!createCourseResponse.ok) {
      const error = await createCourseResponse.json();
      console.error('❌ Create course failed:', error);
    } else {
      const createCourseData = await createCourseResponse.json();
      console.log('✅ Course created successfully:');
      console.log(JSON.stringify(createCourseData, null, 2));
    }

    console.log('\n🎉 Admin API testing completed!');

  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

// Run the tests
testAdminAPIs();