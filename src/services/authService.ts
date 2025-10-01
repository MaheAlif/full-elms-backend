import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { query, queryOne } from '../utils/database';
import { User, LoginRequest, JWTPayload } from '../types';

/**
 * Authentication Service
 * Handles user authentication, JWT generation, and password management
 */
export class AuthService {
  
  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(user: User): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    const options: SignOptions = { 
      expiresIn: '7d',
      issuer: 'elms-backend'
    };
    
    return jwt.sign(payload, secret, options);
  }

  /**
   * Verify JWT token and return payload
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
  }

  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await queryOne(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return user || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findUserById(id: number): Promise<User | null> {
    try {
      const user = await queryOne(
        'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return user || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // Find user by email (including password hash)
      const user = await queryOne(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return null;
      }

      // Compare password
      const isValidPassword = await this.comparePassword(password, user.password_hash);
      
      if (!isValidPassword) {
        return null;
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
      
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Create new user (for registration)
   */
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
    avatar_url?: string;
  }): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(userData.password);
      
      const result: any = await query(
        'INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [userData.name, userData.email, hashedPassword, userData.role, userData.avatar_url || null]
      );

      // Get the created user
      const newUser = await this.findUserById(result.insertId);
      
      if (!newUser) {
        throw new Error('Failed to create user');
      }

      return newUser;
      
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: number, updateData: {
    name?: string;
    email?: string;
    avatar_url?: string;
  }): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (updateData.name) {
        updates.push('name = ?');
        values.push(updateData.name);
      }

      if (updateData.email) {
        updates.push('email = ?');
        values.push(updateData.email);
      }

      if (updateData.avatar_url !== undefined) {
        updates.push('avatar_url = ?');
        values.push(updateData.avatar_url);
      }

      if (updates.length === 0) {
        throw new Error('No valid update fields provided');
      }

      values.push(userId);

      await query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      const updatedUser = await this.findUserById(userId);
      
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser;
      
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get user with password hash
      const user = await queryOne(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await this.comparePassword(currentPassword, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await query(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedNewPassword, userId]
      );

    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Generate password reset token (for future implementation)
   */
  static generatePasswordResetToken(userId: number): string {
    const payload = {
      userId,
      type: 'password_reset',
      exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret');
  }

  /**
   * Check if user exists by email
   */
  static async userExistsByEmail(email: string): Promise<boolean> {
    try {
      const user = await queryOne(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [email]
      );
      return user.count > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }

  /**
   * Get user statistics (for admin dashboard)
   */
  static async getUserStats() {
    try {
      const stats = await queryOne(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
          COUNT(CASE WHEN role = 'teacher' THEN 1 END) as total_teachers,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as total_admins,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_this_week
        FROM users
      `);
      
      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}