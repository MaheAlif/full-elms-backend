import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest, LoginRequest, LoginResponse, ApiResponse } from '../types';

/**
 * Authentication Controller
 * Handles all authentication-related HTTP requests
 */
export class AuthController {

  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role }: LoginRequest = req.body;

      // Authenticate user
      const user = await AuthService.authenticateUser(email, password);
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      // Verify role matches (optional security check)
      if (user.role !== role) {
        res.status(403).json({
          success: false,
          error: 'Role mismatch. Please select the correct role.'
        });
        return;
      }

      // Generate JWT token
      const token = AuthService.generateToken(user);

      // Determine redirect URL based on role
      let redirectUrl = '/dashboard';
      if (role === 'teacher') {
        redirectUrl = '/dashboard/teacher';
      } else if (role === 'admin') {
        redirectUrl = '/dashboard/admin';
      }

      // Prepare response
      const response: LoginResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url
          },
          token,
          redirect_url: redirectUrl
        }
      };

      // Log successful login
      console.log(`✅ User logged in: ${user.email} (${user.role})`);

      res.status(200).json(response);
      return;

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (client-side token removal)
   */
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In JWT-based auth, logout is typically handled client-side
      // But we can log the logout action
      if (req.user) {
        console.log(`👋 User logged out: ${req.user.email} (${req.user.role})`);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
      return;

    } catch (error) {
      console.error('Logout error:', error);
      next(error);
    }
  }

  /**
   * GET /api/auth/session
   * Validate current session and return user info
   */
  static async getSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No valid session found'
        });
        return;
      }

      // Get full user details from database
      const user = await AuthService.findUserById(req.user.userId);
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url
          }
        }
      });
      return;

    } catch (error) {
      console.error('Session validation error:', error);
      next(error);
    }
  }

  /**
   * POST /api/auth/register
   * Register new user (admin only in production)
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, avatar_url } = req.body;

      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      // Create new user
      const newUser = await AuthService.createUser({
        name,
        email,
        password,
        role: role || 'student', // Default to student
        avatar_url
      });

      // Generate token for immediate login
      const token = AuthService.generateToken(newUser);

      // Determine redirect URL
      let redirectUrl = '/dashboard';
      if (newUser.role === 'teacher') {
        redirectUrl = '/dashboard/teacher';
      } else if (newUser.role === 'admin') {
        redirectUrl = '/dashboard/admin';
      }

      console.log(`✨ New user registered: ${newUser.email} (${newUser.role})`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar_url: newUser.avatar_url
          },
          token,
          redirect_url: redirectUrl
        }
      });
      return;

    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { name, email, avatar_url } = req.body;

      // Check if new email is already taken by another user
      if (email && email !== req.user.email) {
        const existingUser = await AuthService.findUserByEmail(email);
        if (existingUser && existingUser.id !== req.user.userId) {
          res.status(409).json({
            success: false,
            error: 'Email is already taken by another user'
          });
          return;
        }
      }

      // Update profile
      const updatedUser = await AuthService.updateUserProfile(req.user.userId, {
        name,
        email,
        avatar_url
      });

      console.log(`📝 Profile updated: ${updatedUser.email}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar_url: updatedUser.avatar_url
          }
        }
      });
      return;

    } catch (error) {
      console.error('Profile update error:', error);
      next(error);
    }
  }

  /**
   * PUT /api/auth/change-password
   * Change user password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          error: 'New password must be at least 6 characters long'
        });
        return;
      }

      // Change password
      await AuthService.changePassword(req.user.userId, currentPassword, newPassword);

      console.log(`🔐 Password changed: ${req.user.email}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
      return;

    } catch (error) {
      if (error instanceof Error && error.message === 'Current password is incorrect') {
        res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
        return;
      }
      
      console.error('Password change error:', error);
      next(error);
    }
  }

  /**
   * GET /api/auth/stats
   * Get user statistics (admin only)
   */
  static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
        return;
      }

      const stats = await AuthService.getUserStats();

      res.status(200).json({
        success: true,
        data: stats
      });
      return;

    } catch (error) {
      console.error('Stats error:', error);
      next(error);
    }
  }
}