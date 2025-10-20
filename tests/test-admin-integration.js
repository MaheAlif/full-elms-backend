const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test admin credentials (adjust as needed)
const ADMIN_CREDENTIALS = {
  email: 'admin.aminul@uiu.ac.bd', // Adjust based on your test admin
  password: 'password123',
  role: 'admin'
};

class AdminIntegrationTest {
  constructor() {
    this.token = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      details: []
    };
  }

  async log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async test(name, testFn) {
    try {
      await testFn();
      this.testResults.passed++;
      this.testResults.details.push({ name, status: 'PASSED' });
      await this.log(`✅ ${name} - PASSED`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.details.push({ name, status: 'FAILED', error: error.message });
      await this.log(`❌ ${name} - FAILED: ${error.message}`);
    }
  }

  async authenticateAdmin() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
      
      if (!response.data.success) {
        throw new Error('Login failed: ' + (response.data.message || 'Unknown error'));
      }
      
      this.token = response.data.data.token;
      console.log('✅ Admin authentication successful');
      return this.token;
    } catch (error) {
      console.error('❌ Admin authentication failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async apiCall(method, endpoint, data = null) {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  async testGetAdminStats() {
    const response = await this.apiCall('GET', '/admin/stats');
    
    if (!response.success) {
      throw new Error('Failed to get admin stats');
    }

    const { users, courses, materials, recent_activity } = response.data;
    
    if (!users || !courses) {
      throw new Error('Missing required stats data');
    }
    
    console.log('Admin Stats:', {
      totalUsers: Array.isArray(users) ? users.reduce((sum, u) => sum + u.count, 0) : 'N/A',
      totalCourses: courses.total_courses || 0,
      totalMaterials: materials?.total_materials || 0
    });
  }

  async testGetAdminCourses() {
    const response = await this.apiCall('GET', '/admin/courses');
    
    if (!response.success) {
      throw new Error('Failed to get admin courses');
    }

    const courses = response.data.courses || response.data;
    console.log(`Found ${Array.isArray(courses) ? courses.length : 'unknown'} courses`);
    
    return Array.isArray(courses) ? courses : [];
  }

  async testCreateCourse() {
    const courseData = {
      course_name: 'Test Integration Course',
      course_code: `TEST_${Date.now()}`,
      description: 'Test course for admin integration',
      credits: 3,
      semester: 'Fall',
      academic_year: '2024'
    };

    const response = await this.apiCall('POST', '/admin/courses', courseData);
    
    if (!response.success) {
      throw new Error('Failed to create course: ' + response.message);
    }

    console.log('Created course:', response.data);
    return response.data;
  }

  async testGetTeachers() {
    const response = await this.apiCall('GET', '/admin/teachers');
    
    if (!response.success) {
      throw new Error('Failed to get teachers');
    }

    const teachers = response.data.teachers || response.data;
    console.log(`Found ${Array.isArray(teachers) ? teachers.length : 'unknown'} teachers`);
    
    return Array.isArray(teachers) ? teachers : [];
  }

  async testGetStudents() {
    const response = await this.apiCall('GET', '/admin/users?role=student');
    
    if (!response.success) {
      throw new Error('Failed to get students');
    }

    const students = response.data.users || response.data;
    console.log(`Found ${Array.isArray(students) ? students.length : 'unknown'} students`);
    
    return Array.isArray(students) ? students : [];
  }

  async testAssignTeacher(teacherId, courseId) {
    const response = await this.apiCall('POST', '/admin/assign-teacher', {
      teacher_id: teacherId,
      course_id: courseId
    });
    
    if (!response.success) {
      throw new Error('Failed to assign teacher: ' + response.message);
    }

    console.log('Teacher assigned successfully');
    return true;
  }

  async testEnrollStudent(studentId, courseId) {
    const response = await this.apiCall('POST', '/admin/enrollments', {
      student_id: studentId,
      course_id: courseId
    });
    
    if (!response.success) {
      throw new Error('Failed to enroll student: ' + response.message);
    }

    console.log('Student enrolled successfully');
    return true;
  }

  async runAllTests() {
    console.log('🚀 Starting Admin Integration Tests...\n');

    try {
      // Authenticate first
      await this.authenticateAdmin();
      
      // Test core admin functionality
      await this.test('Get Admin Statistics', () => this.testGetAdminStats());
      await this.test('Get Admin Courses', () => this.testGetAdminCourses());
      await this.test('Create Course', () => this.testCreateCourse());
      await this.test('Get Teachers', () => this.testGetTeachers());
      await this.test('Get Students', () => this.testGetStudents());
      
      // Integration tests (if we have data)
      const teachers = await this.testGetTeachers();
      const courses = await this.testGetAdminCourses();
      const students = await this.testGetStudents();
      
      if (teachers.length > 0 && courses.length > 0) {
        await this.test('Assign Teacher to Course', () => 
          this.testAssignTeacher(teachers[0].id || teachers[0].user_id, courses[0].id)
        );
      }
      
      if (students.length > 0 && courses.length > 0) {
        await this.test('Enroll Student in Course', () => 
          this.testEnrollStudent(students[0].id || students[0].user_id, courses[0].id)
        );
      }

    } catch (error) {
      console.error('Test suite failed:', error.message);
    }

    // Print results
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📈 Success Rate: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`);

    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.details
        .filter(test => test.status === 'FAILED')
        .forEach(test => console.log(`  - ${test.name}: ${test.error}`));
    }

    return this.testResults.failed === 0;
  }
}

// Run tests
if (require.main === module) {
  const tester = new AdminIntegrationTest();
  tester.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution error:', error);
      process.exit(1);
    });
}

module.exports = AdminIntegrationTest;