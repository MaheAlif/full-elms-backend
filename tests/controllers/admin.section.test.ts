import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';

describe('Admin Section Management Tests', () => {
  let db: Connection;
  let adminToken: string;
  let sectionId: number;

  let courseId: number;
  let teacherId: number;

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

    // Use specific course and teacher IDs
    courseId = 5;
    teacherId = 8;
  });

  describe('POST /api/admin/sections/:id/assign-teacher', () => {
    // First create a test section
    beforeAll(async () => {
      // Create a test section
      const createSectionResponse = await request(app)
        .post('/api/admin/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          course_id: courseId,
          name: 'Test Section A',
          max_capacity: 40
        });

      expect(createSectionResponse.status).toBe(201);
      sectionId = createSectionResponse.body.data.id;
    });

    it('should assign a teacher to a section successfully', async () => {
      const response = await request(app)
        .post(`/api/admin/sections/${sectionId}/assign-teacher`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          teacher_id: teacherId
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent section', async () => {
      const response = await request(app)
        .post('/api/admin/sections/99999/assign-teacher')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          teacher_id: 2
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 404 for non-existent teacher', async () => {
      const response = await request(app)
        .post(`/api/admin/sections/${sectionId}/assign-teacher`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          teacher_id: 99999
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should require admin authentication', async () => {
      // Try without auth token
      const response = await request(app)
        .post(`/api/admin/sections/${sectionId}/assign-teacher`)
        .send({
          teacher_id: 2
        });

      expect(response.status).toBe(401);
    });

    it('should validate teacher_id is provided', async () => {
      const response = await request(app)
        .post(`/api/admin/sections/${sectionId}/assign-teacher`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  // Clean up after tests
  afterAll(async () => {
    if (sectionId) {
      // Remove teacher assignment
      await request(app)
        .delete(`/api/admin/sections/${sectionId}/teacher`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Delete test section
      await request(app)
        .delete(`/api/admin/sections/${sectionId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });
});