const axios = require('axios');

async function testSarahCourses() {
  console.log('\n=== TESTING SARAH JOHNSON\'S COURSES ===\n');

  // Login as Sarah
  const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'sarah.johnson@uiu.ac.bd',
    password: 'password123',
    role: 'teacher'
  });

  if (!loginResponse.data.success) {
    console.error('❌ Login failed:', loginResponse.data.message);
    return;
  }

  console.log('✅ Logged in as Sarah Johnson');
  const token = loginResponse.data.data.token;

  // Get teacher's courses
  const coursesResponse = await axios.get('http://localhost:5000/api/teacher/courses', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!coursesResponse.data.success) {
    console.error('❌ Failed to get courses:', coursesResponse.data.message);
    return;
  }

  console.log('\n📚 COURSES SARAH CAN SEE:\n');
  const courses = coursesResponse.data.data.courses;
  
  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.course_name} (${course.course_code})`);
    console.log(`   - Students: ${course.student_count}`);
    console.log(`   - Sections: ${course.section_count}`);
    console.log(`   - Materials: ${course.material_count}`);
    console.log('');
  });

  // Check if Economics is in the list
  const economicsCourse = courses.find(c => c.course_name.includes('Economics'));
  
  if (economicsCourse) {
    console.log('✅ SUCCESS! Sarah can now see Economics course!');
    console.log(`   Course ID: ${economicsCourse.id}`);
    console.log(`   Course Code: ${economicsCourse.course_code}`);
    console.log(`   Students: ${economicsCourse.student_count}`);
  } else {
    console.log('❌ PROBLEM: Economics course still not visible to Sarah');
  }
}

testSarahCourses().catch(error => {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
});
