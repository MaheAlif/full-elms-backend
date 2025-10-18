import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';

describe('Admin Student Creation Tests', () => {
  let db: Connection;
  let adminToken: string;
  let createdStudentIds: number[] = [];

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

  describe('POST /api/admin/students', () => {
    it('should create a new student successfully', async () => {
      const newStudent = {
        name: 'Test Student',
        email: 'teststudent@uiu.ac.bd',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Student account created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newStudent.name);
      expect(response.body.data).toHaveProperty('email', newStudent.email);
      expect(response.body.data).toHaveProperty('role', 'student');
      expect(response.body.data).not.toHaveProperty('password'); // Password should not be returned

      createdStudentIds.push(response.body.data.id);
    });

    it('should not create student with duplicate email', async () => {
      const duplicateStudent = {
        name: 'Another Student',
        email: 'teststudent@uiu.ac.bd', // Same email as previous test
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });

    it('should require admin authentication', async () => {
      const newStudent = {
        name: 'Unauthorized Student',
        email: 'unauthorized@uiu.ac.bd',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .send(newStudent);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const invalidStudent = {
        name: 'Invalid Student',
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('required');
    });

    it('should validate email format', async () => {
      const invalidStudent = {
        name: 'Invalid Email Student',
        email: 'invalid-email', // Invalid email format
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('email');
    });

    it('should validate password length', async () => {
      const invalidStudent = {
        name: 'Short Password Student',
        email: 'shortpass@uiu.ac.bd',
        password: '12345' // Less than min length 6
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('password');
    });

    it('should validate name length', async () => {
      const invalidStudent = {
        name: 'A', // Less than min length 2
        email: 'shortname@uiu.ac.bd',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('name');
    });

    it('should enforce email domain', async () => {
      const invalidStudent = {
        name: 'Wrong Domain Student',
        email: 'student@gmail.com', // Not UIU domain
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('UIU email');
    });
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test students
    for (const studentId of createdStudentIds) {
      await db.execute(
        'DELETE FROM users WHERE id = ?',
        [studentId]
      );
    }
  });
});