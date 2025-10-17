import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';
import { clearTestData } from '../utils/testDb';

describe('TeacherController', () => {
  let testDb: Connection;
  let teacherToken: string;
  let courseId: number;

  beforeAll(async () => {
    testDb = global.testDb;
    
    // Create and login as teacher
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

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: teacherData.email,
        password: teacherData.password,
        role: teacherData.role
      });

    teacherToken = loginResponse.body.token;

    // Create a test course and assign to teacher
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

    // Assign teacher to course
    await request(app)
      .post('/api/admin/assign-teacher')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        teacherId: loginResponse.body.user.id,
        courseId
      });
  });

  beforeEach(async () => {
    await clearTestData(testDb);
  });

  describe('Course Materials', () => {
    it('should upload course material', async () => {
      const response = await request(app)
        .post('/api/teacher/materials/upload')
        .set('Authorization', `Bearer ${teacherToken}`)
        .field('courseId', courseId)
        .field('title', 'Lecture 1')
        .field('description', 'Introduction to Software Engineering')
        .attach('file', 'tests/fixtures/test.pdf');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.material).toHaveProperty('title', 'Lecture 1');
    });

    it('should get list of materials', async () => {
      const response = await request(app)
        .get('/api/teacher/materials')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('materials');
      expect(Array.isArray(response.body.materials)).toBe(true);
    });
  });

  describe('Assignments', () => {
    it('should create an assignment', async () => {
      const assignmentData = {
        courseId,
        title: 'Assignment 1',
        description: 'First programming assignment',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        totalMarks: 100
      };

      const response = await request(app)
        .post('/api/teacher/assignments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(assignmentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.assignment).toMatchObject({
        title: assignmentData.title,
        description: assignmentData.description,
        totalMarks: assignmentData.totalMarks
      });
    });

    it('should update an assignment', async () => {
      // First create an assignment
      const createResponse = await request(app)
        .post('/api/teacher/assignments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          courseId,
          title: 'Assignment 1',
          description: 'First programming assignment',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalMarks: 100
        });

      const assignmentId = createResponse.body.assignment.id;

      // Update the assignment
      const updateData = {
        title: 'Updated Assignment 1',
        description: 'Updated description',
        totalMarks: 150
      };

      const response = await request(app)
        .put(`/api/teacher/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.assignment).toMatchObject(updateData);
    });

    it('should delete an assignment', async () => {
      // First create an assignment
      const createResponse = await request(app)
        .post('/api/teacher/assignments')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          courseId,
          title: 'Assignment 1',
          description: 'First programming assignment',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalMarks: 100
        });

      const assignmentId = createResponse.body.assignment.id;

      // Delete the assignment
      const response = await request(app)
        .delete(`/api/teacher/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify assignment is deleted
      const getResponse = await request(app)
        .get(`/api/teacher/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});