import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';

describe('Admin Section Creation Tests', () => {
  let db: Connection;
  let adminToken: string;
  let courseId: number = 5; // Using known course ID from previous tests
  let teacherId: number = 8; // Using known teacher ID from previous tests
  let createdSectionIds: number[] = [];

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

  describe('POST /api/admin/sections', () => {
    it('should create a new section successfully', async () => {
      const uniqueName = `Test Section ${Date.now()}`;
      const newSection = {
        course_id: courseId,
        name: uniqueName,
        teacher_id: teacherId,
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSection);

      console.log('Response Body:', response.body);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Section created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newSection.name);
      expect(response.body.data).toHaveProperty('course_id', newSection.course_id);
      expect(response.body.data).toHaveProperty('teacher_id', newSection.teacher_id);
      expect(response.body.data).toHaveProperty('max_capacity', newSection.max_capacity);
      expect(response.body.data).toHaveProperty('course_code');
      expect(response.body.data).toHaveProperty('course_title');
      expect(response.body.data).toHaveProperty('teacher_name');

      createdSectionIds.push(response.body.data.id);
    });

    it('should create a section without a teacher', async () => {
      const uniqueName = `Test Section No Teacher ${Date.now()}`;
      const newSection = {
        course_id: courseId,
        name: uniqueName,
        max_capacity: 35
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSection);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('teacher_id', null);
      expect(response.body.data).toHaveProperty('max_capacity', 35);
      createdSectionIds.push(response.body.data.id);
    });

    it('should not create section with duplicate name in same course', async () => {
      const duplicateSection = {
        course_id: courseId,
        name: 'Test Section XYZ', // Same name as first test
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateSection);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });

    it('should not create section for non-existent course', async () => {
      const invalidSection = {
        course_id: 99999,
        name: 'Invalid Course Section',
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidSection);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Course not found');
    });

    it('should not create section with non-existent teacher', async () => {
      const invalidSection = {
        course_id: courseId,
        name: 'Invalid Teacher Section',
        teacher_id: 99999,
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidSection);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Teacher not found');
    });

    it('should require admin authentication', async () => {
      const newSection = {
        course_id: courseId,
        name: 'Unauthorized Section',
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .send(newSection);

      expect(response.status).toBe(401);
    });

    it('should require course_id and name', async () => {
      const invalidSection = {
        max_capacity: 40
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidSection);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should require max_capacity', async () => {
      const sectionWithoutCapacity = {
        course_id: courseId,
        name: 'Default Capacity Section'
      };

      const response = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sectionWithoutCapacity);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('max_capacity');
    });
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test sections
    for (const sectionId of createdSectionIds) {
      await db.execute(
        'DELETE FROM sections WHERE id = ?',
        [sectionId]
      );
    }
  });
});