import request from 'supertest';
import app from '../../src/app';
import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

describe('Admin Teacher Management Tests', () => {
  let db: Connection;
  let adminToken: string;
  let createdTeacherId: number;

  beforeAll(async () => {
    db = global.testDb;

    // Clean up any existing test data
    try {
      // Delete related records first
      const [users] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        ['test.teacher@uiu.ac.bd']
      ) as [RowDataPacket[], any];
      
      if (users.length > 0) {
        const userId = users[0].id;
        await db.execute('DELETE FROM enrollments WHERE teacher_id = ?', [userId]);
        await db.execute('DELETE FROM courses WHERE teacher_id = ?', [userId]);
        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
      }
    } catch (error) {
      console.error('Failed to cleanup test data:', error);
    }

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

  describe('POST /api/admin/teachers', () => {
    it('should create a new teacher account successfully', async () => {
      const newTeacher = {
        name: 'Test Teacher',
        email: 'test.teacher@uiu.ac.bd',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newTeacher);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Teacher account created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newTeacher.name);
      expect(response.body.data).toHaveProperty('email', newTeacher.email);
      expect(response.body.data).toHaveProperty('role', 'teacher');

      createdTeacherId = response.body.data.id;

      // Verify teacher can log in
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: newTeacher.email,
          password: newTeacher.password,
          role: 'teacher'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data.user).toHaveProperty('role', 'teacher');
    });

    it('should not create teacher with existing email', async () => {
      const existingTeacher = {
        name: 'Duplicate Teacher',
        email: 'test.teacher@uiu.ac.bd', // Using same email as previous test
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(existingTeacher);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Email already exists');
    });

    it('should validate required fields', async () => {
      const invalidTeacher = {
        name: 'Invalid Teacher'
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidTeacher);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should require admin authentication', async () => {
      const newTeacher = {
        name: 'Unauthorized Teacher',
        email: 'unauthorized@uiu.ac.bd',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .send(newTeacher);

      expect(response.status).toBe(401);
    });

    it('should validate email format', async () => {
      const invalidTeacher = {
        name: 'Invalid Email Teacher',
        email: 'invalid-email', // Invalid email format
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/admin/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidTeacher);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  // Clean up after tests
  afterAll(async () => {
    if (createdTeacherId) {
      try {
        // Delete related records first (if any)
        await db.execute(
          'DELETE FROM courses WHERE teacher_id = ?',
          [createdTeacherId]
        );
        
        // Now delete the user
        await db.execute(
          'DELETE FROM users WHERE id = ? AND role = "teacher"',
          [createdTeacherId]
        );
      } catch (error) {
        console.error('Failed to cleanup test data:', error);
      }
    }
  });
});