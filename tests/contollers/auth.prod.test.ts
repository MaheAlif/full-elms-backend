import request from 'supertest';
import app from '../../src/app';
import { Connection } from 'mysql2/promise';

describe('Authentication Tests (Production DB)', () => {
  let db: Connection;

  beforeAll(() => {
    db = global.testDb;
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate existing student with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mahe221130@bscse.uiu.ac.bd',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('role', 'student');
    });

    it('should authenticate existing teacher with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'shihab123@gmail.com',
          password: 'shihab123',
          role: 'teacher'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('role', 'teacher');
    });

    it('should not authenticate with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@uiu.ac.bd',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should not authenticate with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mahe221130@bscse.uiu.ac.bd',
          password: 'wrongpassword',
          role: 'student'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalidemail',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Token Validation', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get a valid token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'mahe221130@bscse.uiu.ac.bd',
          password: 'password123',
          role: 'student'
        });
      authToken = response.body.data.token;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/student/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject access with invalid token', async () => {
      const response = await request(app)
        .get('/api/student/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(403);
    });
  });
});