import request from 'supertest';
import app from '../../src/app';
import { AuthService } from '../../src/services/authService';
import { Connection } from 'mysql2/promise';
import { clearTestData } from '../utils/testDb';

describe('AuthController', () => {
  let testDb: Connection;

  beforeAll(() => {
    testDb = global.testDb;
  });

  beforeEach(async () => {
    await clearTestData(testDb);
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      // Create a test user first
      const testUser = {
        name: 'Test User',
        email: 'test@uiu.ac.bd',
        password: 'password123',
        role: 'student'
      };

      // Register the test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Attempt login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
          role: testUser.role
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
      expect(response.body.data.user).toHaveProperty('role', testUser.role);
    });

    it('should reject login with invalid password', async () => {
      const testUser = {
        email: 'test@uiu.ac.bd',
        password: 'password123',
        role: 'student'
      };

      // Register the test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Attempt login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
          role: testUser.role
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@uiu.ac.bd',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with role mismatch', async () => {
      const testUser = {
        email: 'test@uiu.ac.bd',
        password: 'password123',
        role: 'student'
      };

      // Register the test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Attempt login with wrong role
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
          role: 'teacher'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});