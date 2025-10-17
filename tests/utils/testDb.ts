import mysql, { Connection } from 'mysql2/promise';
import path from 'path';
import fs from 'fs';

export async function createTestDatabase(): Promise<Connection> {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const dbName = `test_elms_${Math.floor(Math.random() * 10000)}`;

    // Create test database
    await connection.query(`
      DROP DATABASE IF EXISTS ${dbName};
      CREATE DATABASE ${dbName};
      USE ${dbName};
    `);

    // Run schema creation script
    const schemaPath = path.join(__dirname, '../fixtures/test_schema.sql');
    const schemaScript = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaScript);

    return connection;
  } catch (error) {
    console.error('Failed to create test database:', error);
    throw error;
  }
}

export async function clearTestData(connection: Connection): Promise<void> {
  // Check which tables exist first
  const [tables] = await connection.query<any>('SHOW TABLES');
  const existingTables = tables.map((row: any) => Object.values(row)[0]);

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Only truncate tables that exist
    for (const table of existingTables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
    }
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  }
}