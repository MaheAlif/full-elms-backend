import dotenv from 'dotenv';
import { Connection } from 'mysql2/promise';
import { createTestDatabase } from './utils/testDb';
import app from '../src/app';

// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Increase test timeout
jest.setTimeout(30000);

// Global test database connection
let testDb: Connection;
let server: any;

beforeAll(async () => {
  try {
    // Create test database and get connection
    testDb = await createTestDatabase();
    global.testDb = testDb;

    // Start server on a different port for testing
    server = app.listen(0); // This will choose a random available port
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close database connection
    if (testDb) {
      await testDb.end();
    }
    // Close server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error('Test cleanup failed:', error);
    throw error;
  }
});