// Comprehensive Admin API Testing Suite
const http = require('http');

class AdminAPITester {
  constructor() {
    this.baseUrl = 'localhost';
    this.port = 5000;
    this.token = null;
  }

  makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve({ status: res.statusCode, data: response });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async login() {
    console.log('🔐 Admin Login Test');
    
    const options = {
      hostname: this.baseUrl,
      port: this.port,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = {
      email: 'admin.aminul@uiu.ac.bd',
      password: 'password123',
      role: 'admin'
    };

    try {
      const response = await this.makeRequest(options, loginData);
      
      if (response.status === 200 && response.data.success) {
        this.token = response.data.data.token;
        console.log('✅ Admin login successful');
        return true;
      } else {
        console.log('❌ Admin login failed:', response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Login request error:', error.message);
      return false;
    }
  }

  async testSystemStats() {
    console.log('\n📊 System Statistics Test');
    
    const options = {
      hostname: this.baseUrl,
      port: this.port,
      path: '/api/admin/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await this.makeRequest(options);
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ System stats retrieved successfully');
        console.log('   Users by role:', response.data.data.users);
        console.log('   Courses:', response.data.data.courses);
        console.log('   Materials:', response.data.data.materials);
        return true;
      } else {
        console.log('❌ System stats failed:', response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Stats request error:', error.message);
      return false;
    }
  }

  async testGetCourses() {
    console.log('\n📚 Get All Courses Test');
    
    const options = {
      hostname: this.baseUrl,
      port: this.port,
      path: '/api/admin/courses?page=1&limit=5',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await this.makeRequest(options);
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ Courses retrieved successfully');
        console.log(`   Found ${response.data.data.courses.length} courses`);
        console.log('   Pagination:', response.data.data.pagination);
        if (response.data.data.courses.length > 0) {
          console.log('   Sample course:', response.data.data.courses[0].title || response.data.data.courses[0].course_name);
        }
        return true;
      } else {
        console.log('❌ Get courses failed:', response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Get courses error:', error.message);
      return false;
    }
  }

  async testGetTeachers() {
    console.log('\n👨‍🏫 Get All Teachers Test');
    
    const options = {
      hostname: this.baseUrl,
      port: this.port,
      path: '/api/admin/teachers',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await this.makeRequest(options);
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ Teachers retrieved successfully');
        console.log(`   Found ${response.data.data.teachers.length} teachers`);
        if (response.data.data.teachers.length > 0) {
          const teacher = response.data.data.teachers[0];
          console.log(`   Sample teacher: ${teacher.first_name || teacher.name} (${teacher.email})`);
        }
        return true;
      } else {
        console.log('❌ Get teachers failed:', response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Get teachers error:', error.message);
      return false;
    }
  }

  async testGetUsers() {
    console.log('\n👥 Get All Users Test');
    
    const options = {
      hostname: this.baseUrl,
      port: this.port,
      path: '/api/admin/users?role=student&limit=3',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await this.makeRequest(options);
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ Users retrieved successfully');
        console.log(`   Found ${response.data.data.users.length} students`);
        console.log('   Pagination:', response.data.data.pagination);
        return true;
      } else {
        console.log('❌ Get users failed:', response.data);
        return false;
      }
    } catch (error) {
      console.log('❌ Get users error:', error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Admin API Tests\n');
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Login first
    const loginSuccess = await this.login();
    if (!loginSuccess) {
      console.log('\n❌ Cannot proceed without successful login');
      return results;
    }

    const tests = [
      { name: 'System Stats', fn: () => this.testSystemStats() },
      { name: 'Get Courses', fn: () => this.testGetCourses() },
      { name: 'Get Teachers', fn: () => this.testGetTeachers() },
      { name: 'Get Users', fn: () => this.testGetUsers() }
    ];

    for (const test of tests) {
      results.total++;
      try {
        const success = await test.fn();
        if (success) {
          results.passed++;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.log(`❌ ${test.name} test crashed:`, error.message);
        results.failed++;
      }
    }

    console.log('\n📋 Test Results Summary:');
    console.log(`   Total Tests: ${results.total}`);
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    return results;
  }
}

// Run the tests
const tester = new AdminAPITester();
tester.runAllTests();