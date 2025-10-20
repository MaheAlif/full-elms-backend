import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';

describe('Admin Course Creation Tests', () => {
  let db: Connection;
  let adminToken: string;
  let createdCourseIds: number[] = [];

  beforeAll(async () => {
    db = global.testDb;

    // Login as admin to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.aminul@uiu.ac.bd',
        password: 'password123',
        role: 'admin'
      });

    expect(loginResponse.status).toBe(200);
    adminToken = loginResponse.body.data.token;
  });

  describe('POST /api/admin/courses', () => {
    it('should create a new course successfully', async () => {
      const newCourse = {
        course_name: 'Test Course ABC',
        course_code: 'TEST101',
        description: 'A test course for unit testing',
        credits: 3,
        semester: 'Fall',
        academic_year: '2025-2026'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Course created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('course_name', newCourse.course_name);
      expect(response.body.data).toHaveProperty('course_code', newCourse.course_code);
      expect(response.body.data).toHaveProperty('credits', newCourse.credits);

      createdCourseIds.push(response.body.data.id);
    });

    it('should not create course with duplicate course code', async () => {
      const duplicateCourse = {
        course_name: 'Another Test Course',
        course_code: 'TEST101', // Same code as previous test
        description: 'This should fail',
        credits: 3,
        semester: 'Fall',
        academic_year: '2025-2026'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateCourse);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });

    it('should require admin authentication', async () => {
      const newCourse = {
        course_name: 'Unauthorized Course',
        course_code: 'UNAUTH101',
        credits: 3,
        semester: 'Fall',
        academic_year: '2025-2026'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .send(newCourse);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const invalidCourse = {
        course_name: 'Invalid Course',
        // Missing required fields
        semester: 'Fall'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCourse);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should validate credit hours range', async () => {
      const invalidCourse = {
        course_name: 'Invalid Credits Course',
        course_code: 'CRED999',
        description: 'Course with invalid credits',
        credits: 15, // Max is 10
        semester: 'Fall',
        academic_year: '2025-2026'
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCourse);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('credits');
    });

    it('should validate academic year format', async () => {
      const invalidCourse = {
        course_name: 'Invalid Year Course',
        course_code: 'YEAR101',
        description: 'Course with invalid academic year',
        credits: 3,
        semester: 'Fall',
        academic_year: '2025' // Invalid format
      };

      const response = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCourse);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('academic_year');
    });
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test courses
    for (const courseId of createdCourseIds) {
      await db.execute(
        'DELETE FROM courses WHERE id = ?',
        [courseId]
      );
    }
  });
});