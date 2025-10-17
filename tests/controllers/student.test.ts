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
    
    // Create and login as student
    const studentData = {
      email: 'student@uiu.ac.bd',
      password: 'student123',
      name: 'Test Student',
      studentId: '011201234',
      department: 'CSE',
      role: 'student'
    };

    await request(app)
      .post('/api/auth/register')
      .send(studentData);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: studentData.email,
        password: studentData.password,
        role: studentData.role
      });

    studentToken = loginResponse.body.token;

    // Setup test course and assignment
    const adminData = {
      email: 'admin@uiu.ac.bd',
      password: 'admin123',
      role: 'admin',
      name: 'Test Admin'
    };

    await request(app)
      .post('/api/auth/register')
      .send(adminData);

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminData.email,
        password: adminData.password,
        role: adminData.role
      });

    const adminToken = adminLogin.body.token;

    // Create course
    const courseResponse = await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'CSE4047',
        name: 'Software Engineering',
        description: 'Learn software engineering principles',
        credits: 3
      });

    courseId = courseResponse.body.course.id;

    // Enroll student in course
    await request(app)
      .post('/api/admin/enrollments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: loginResponse.body.user.id,
        courseId
      });

    // Create teacher and assignment
    const teacherData = {
      email: 'teacher@uiu.ac.bd',
      password: 'teacher123',
      name: 'Test Teacher',
      department: 'CSE',
      role: 'teacher'
    };

    await request(app)
      .post('/api/auth/register')
      .send(teacherData);

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
      .set('Authorization', `Bearer ${teacherLogin.body.token}`)
      .send({
        courseId,
        title: 'Assignment 1',
        description: 'Test assignment',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalMarks: 100
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