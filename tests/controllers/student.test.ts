import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';
import { clearTestData } from '../utils/testDb';

describe('StudentController', () => {
  let testDb: Connection;
  let studentToken: string;
  let courseId: number;
  let assignmentId: number;

  beforeAll(async () => {
    testDb = global.testDb;
    
    // Login as existing student
    const studentData = {
      email: 'mahe221130@bscse.uiu.ac.bd',
      password: 'password123',
      role: 'student'
    };

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: studentData.email,
        password: studentData.password,
        role: studentData.role
      });

    studentToken = loginResponse.body.data.token;

    // Use existing admin account
    const adminData = {
      email: 'admin.aminul@uiu.ac.bd',
      password: 'password123', // This should match the hash in the database
      role: 'admin'
    };

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminData.email,
        password: adminData.password,
        role: adminData.role
      });

    const adminToken = adminLogin.body.data.token;

    // Create course
    const courseResponse = await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        course_name: 'Software Engineering',
        course_code: 'CSE4047',
        description: 'Learn software engineering principles',
        credits: 3,
        semester: 'Fall',
        academic_year: '2025-2026'
      });

    courseId = courseResponse.body.id;

    // Enroll student in course
    await request(app)
      .post('/api/admin/enrollments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: loginResponse.body.data.user.id,
        section_id: 1 // Using the first section for testing
      });

    // Use existing teacher account
    const teacherData = {
      email: 'sarah.johnson@uiu.ac.bd',
      password: 'password123',
      role: 'teacher'
    };

    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: teacherData.email,
        password: teacherData.password,
        role: teacherData.role
      });

    // Create assignment
    const assignmentResponse = await request(app)
      .post('/api/teacher/assignments')
      .set('Authorization', `Bearer ${teacherLogin.body.data.token}`)
      .send({
        section_id: 1, // Using the first section for testing
        title: 'Assignment 1',
        description: 'Test assignment',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_marks: 100
      });

    assignmentId = assignmentResponse.body.assignment.id;
  });

  beforeEach(async () => {
    await clearTestData(testDb);
  });

  describe('Course Access', () => {
    it('should get enrolled courses', async () => {
      const response = await request(app)
        .get('/api/student/courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('courses');
      expect(Array.isArray(response.body.courses)).toBe(true);
      expect(response.body.courses.length).toBeGreaterThan(0);
    });

    it('should get course details', async () => {
      const response = await request(app)
        .get(`/api/student/courses/${courseId}/details`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('course');
      expect(response.body.course).toHaveProperty('id', courseId);
    });
  });

  describe('Assignments', () => {
    it('should get assignments list', async () => {
      const response = await request(app)
        .get('/api/student/assignments')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });

    it('should get assignment details', async () => {
      const response = await request(app)
        .get(`/api/student/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('assignment');
      expect(response.body.assignment).toHaveProperty('id', assignmentId);
    });

    it('should submit assignment', async () => {
      const response = await request(app)
        .post(`/api/student/assignments/${assignmentId}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('file', 'tests/fixtures/test-submission.pdf')
        .field('comment', 'Test submission');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('submission');
      expect(response.body.submission).toHaveProperty('assignmentId', assignmentId);
    });
  });

  describe('Materials', () => {
    it('should get course materials', async () => {
      const response = await request(app)
        .get('/api/student/materials')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('materials');
      expect(Array.isArray(response.body.materials)).toBe(true);
    });
  });
});