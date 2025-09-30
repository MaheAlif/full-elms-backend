import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('🔗 Testing database connection...');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    
    connection.release();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

/**
 * Execute a query with parameters
 */
export const query = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Execute a query and return the first result
 */
export const queryOne = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const rows = await query(sql, params);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Begin transaction
 */
export const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

/**
 * Execute query within transaction
 */
export const queryTransaction = async (
  connection: mysql.PoolConnection, 
  sql: string, 
  params: any[] = []
): Promise<any> => {
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Transaction query error:', error);
    throw error;
  }
};

/**
 * Commit transaction
 */
export const commitTransaction = async (connection: mysql.PoolConnection) => {
  await connection.commit();
  connection.release();
};

/**
 * Rollback transaction
 */
export const rollbackTransaction = async (connection: mysql.PoolConnection) => {
  await connection.rollback();
  connection.release();
};

/**
 * Get database pool for advanced usage
 */
export const getPool = () => pool;

export default {
  connectDatabase,
  query,
  queryOne,
  beginTransaction,
  queryTransaction,
  commitTransaction,
  rollbackTransaction,
  getPool
};