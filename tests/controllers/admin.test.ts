import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';
import { clearTestData } from '../utils/testDb';
import { AuthService } from '../../src/services/authService';

describe('AdminController', () => {
  let testDb: Connection;
  let adminToken: string;

  beforeAll(async () => {
    testDb = global.testDb;
    
    // Create and login as admin
    const adminUser = {
      email: 'admin@uiu.ac.bd',
      password: 'admin123',
      role: 'admin',
      name: 'Test Admin'
    };

    await request(app)
      .post('/api/auth/register')
      .send(adminUser);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
        role: adminUser.role
      });

    adminToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await clearTestData(testDb);
  });

  describe('Course Management', () => {
    it('should create a new course', async () => {
      const courseData = {
        code: 'CSE4047',
        name: 'Software Engineering',
        description: 'Learn software engineering principles',
        credits: 3
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.course).toMatchObject(courseData);
    });

    it('should get list of courses', async () => {
      const response = await request(app)
        .get('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('courses');
      expect(Array.isArray(response.body.courses)).toBe(true);
    });

    it('should update a course', async () => {
      // First create a course
      const courseData = {
        code: 'CSE4047',
        name: 'Software Engineering',
        description: 'Learn software engineering principles',
        credits: 3
      };

      const createResponse = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      const courseId = createResponse.body.course.id;

      // Update the course
      const updateData = {
        name: 'Advanced Software Engineering',
        description: 'Advanced software engineering concepts',
        credits: 4
      };

      const response = await request(app)
        .put(`/api/admin/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.course).toMatchObject(updateData);
    });

    it('should delete a course', async () => {
      // First create a course
      const courseData = {
        code: 'CSE4047',
        name: 'Software Engineering',
        description: 'Learn software engineering principles',
        credits: 3
      };

      const createResponse = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      const courseId = createResponse.body.course.id;

      // Delete the course
      const response = await request(app)
        .delete(`/api/admin/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify course is deleted
      const getResponse = await request(app)
        .get(`/api/admin/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('User Management', () => {
    it('should create a new teacher', async () => {
      const teacherData = {
        email: 'teacher@uiu.ac.bd',
        password: 'teacher123',
        name: 'Test Teacher',
        department: 'CSE'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(teacherData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.teacher).toMatchObject({
        email: teacherData.email,
        name: teacherData.name,
        department: teacherData.department
      });
    });

    it('should create a new student', async () => {
      const studentData = {
        email: 'student@uiu.ac.bd',
        password: 'student123',
        name: 'Test Student',
        studentId: '011201234',
        department: 'CSE'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.student).toMatchObject({
        email: studentData.email,
        name: studentData.name,
        studentId: studentData.studentId,
        department: studentData.department
      });
    });
  });
});