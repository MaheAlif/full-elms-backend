import { Request, Response } from 'express';
import { getPool } from '../utils/database';
import { AuthenticatedRequest } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class AdminController {
  // ===== COURSE MANAGEMENT =====
  
  /**
   * Get all courses with pagination
   * GET /api/admin/courses
   */
  static async getCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      const connection = getPool();
      
      // Get courses with teacher information
      const [courses] = await connection.execute(`
        SELECT 
          c.id,
          c.title as course_name,
          c.course_code,
          c.description,
          c.credits,
          c.semester,
          c.academic_year,
          c.color,
          c.teacher_id,
          c.created_at,
          u.name as teacher_name,
          u.email as teacher_email,
          COUNT(DISTINCT e.user_id) as student_count
        FROM courses c
        LEFT JOIN users u ON c.teacher_id = u.id AND u.role = 'teacher'
        LEFT JOIN enrollments e ON c.id = e.course_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);

      // Get total count
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total FROM courses
      `);
      
      const total = (countResult as RowDataPacket[])[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          courses,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve courses'
      });
    }
  }

  /**
   * Create a new course
   * POST /api/admin/courses
   */
  static async createCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        course_name,
        course_code,
        description,
        credits,
        semester,
        academic_year
      } = req.body;

      const connection = getPool();
      
      // Check if course code already exists
      const [existingCourse] = await connection.execute(
        'SELECT id FROM courses WHERE course_code = ?',
        [course_code]
      );

      if ((existingCourse as RowDataPacket[]).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Course code already exists'
        });
      }

      // Create course without teacher_id (will be assigned later)
      const [result] = await connection.execute(
        `INSERT INTO courses (title, course_code, description, credits, semester, academic_year, color)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [course_name, course_code, description || '', credits, semester, academic_year, 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20']
      );

      const courseId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
          id: courseId,
          course_name,
          course_code,
          description: description || '',
          credits,
          semester,
          academic_year,
          teacher_id: null,
          color: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
        }
      });
    } catch (error) {
      console.error('Create course error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create course'
      });
    }
  }

  /**
   * Update a course
   * PUT /api/admin/courses/:id
   */
  static async updateCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const {
        course_name,
        course_code,
        description,
        credits,
        semester,
        academic_year
      } = req.body;

      const connection = getPool();
      
      // Check if course exists
      const [existingCourse] = await connection.execute(
        'SELECT id FROM courses WHERE id = ?',
        [courseId]
      );

      if ((existingCourse as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if course code is taken by another course
      const [codeCheck] = await connection.execute(
        'SELECT id FROM courses WHERE course_code = ? AND id != ?',
        [course_code, courseId]
      );

      if ((codeCheck as RowDataPacket[]).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Course code already exists'
        });
      }

      await connection.execute(
        `UPDATE courses 
         SET title = ?, course_code = ?, description = ?, 
             credits = ?, semester = ?, academic_year = ?
         WHERE id = ?`,
        [course_name, course_code, description, credits, semester, academic_year, courseId]
      );

      return res.json({
        success: true,
        message: 'Course updated successfully'
      });
    } catch (error) {
      console.error('Update course error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update course'
      });
    }
  }

  /**
   * Delete a course
   * DELETE /api/admin/courses/:id
   */
  static async deleteCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const connection = getPool();
      
      // Check if course exists
      const [existingCourse] = await connection.execute(
        'SELECT id FROM courses WHERE id = ?',
        [courseId]
      );

      if ((existingCourse as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if course has enrollments
      const [enrollments] = await connection.execute(
        'SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?',
        [courseId]
      );

      const enrollmentCount = (enrollments as RowDataPacket[])[0].count;

      if (enrollmentCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete course with existing enrollments'
        });
      }

      await connection.execute(
        'DELETE FROM courses WHERE id = ?',
        [courseId]
      );

      return res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      console.error('Delete course error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete course'
      });
    }
  }

  // ===== USER MANAGEMENT =====

  /**
   * Get all users with filtering and pagination
   * GET /api/admin/users
   */
  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;
      const search = req.query.search as string;
      const offset = (page - 1) * limit;
      
      const connection = getPool();
      
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      
      if (role && ['student', 'teacher', 'admin'].includes(role)) {
        whereClause += ' AND role = ?';
        params.push(role);
      }
      
      if (search) {
        whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      // Get users
      const [users] = await connection.execute(`
        SELECT 
          id,
          name,
          email,
          role,
          created_at
        FROM users 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset]);

      // Get total count
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total FROM users ${whereClause}
      `, params);
      
      const total = (countResult as RowDataPacket[])[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users'
      });
    }
  }

  /**
   * Get teachers for course assignment
   * GET /api/admin/teachers
   */
  static async getTeachers(req: AuthenticatedRequest, res: Response) {
    try {
      const connection = getPool();
      
      const [teachers] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          COUNT(c.id) as course_count
        FROM users u
        LEFT JOIN courses c ON u.id = c.teacher_id
        WHERE u.role = 'teacher'
        GROUP BY u.id
        ORDER BY u.name
      `);

      res.json({
        success: true,
        data: { teachers }
      });
    } catch (error) {
      console.error('Get teachers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve teachers'
      });
    }
  }

  /**
   * Assign teacher to course
   * POST /api/admin/assign-teacher
   */
  static async assignTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const { teacher_id, course_id } = req.body;
      
      const connection = getPool();
      
      // Verify teacher exists and has teacher role
      const [teacher] = await connection.execute(
        'SELECT id FROM users WHERE id = ? AND role = "teacher"',
        [teacher_id]
      );

      if ((teacher as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Verify course exists
      const [course] = await connection.execute(
        'SELECT id FROM courses WHERE id = ?',
        [course_id]
      );

      if ((course as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Update course with teacher assignment
      await connection.execute(
        'UPDATE courses SET teacher_id = ? WHERE id = ?',
        [teacher_id, course_id]
      );

      return res.json({
        success: true,
        message: 'Teacher assigned to course successfully'
      });
    } catch (error) {
      console.error('Assign teacher error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign teacher to course'
      });
    }
  }

  /**
   * Remove teacher assignment from course
   * DELETE /api/admin/assign-teacher
   */
  static async removeTeacherAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const { course_id } = req.body;
      
      const connection = getPool();
      
      // Verify course exists
      const [course] = await connection.execute(
        'SELECT id FROM courses WHERE id = ?',
        [course_id]
      );

      if ((course as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Remove teacher assignment (set to NULL)
      await connection.execute(
        'UPDATE courses SET teacher_id = NULL WHERE id = ?',
        [course_id]
      );

      return res.json({
        success: true,
        message: 'Teacher assignment removed successfully'
      });
    } catch (error) {
      console.error('Remove teacher assignment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove teacher assignment'
      });
    }
  }

  // ===== ENROLLMENT MANAGEMENT =====

  /**
   * Get course enrollments
   * GET /api/admin/enrollments/:courseId
   */
  static async getCourseEnrollments(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.params.courseId;
      const connection = getPool();
      
      const [enrollments] = await connection.execute(`
        SELECT 
          e.id as enrollment_id,
          e.enrolled_at,
          u.id as user_id,
          u.name,
          u.email
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = ? AND u.role = 'student'
        ORDER BY u.name
      `, [courseId]);

      res.json({
        success: true,
        data: { enrollments }
      });
    } catch (error) {
      console.error('Get course enrollments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve course enrollments'
      });
    }
  }

  /**
   * Enroll student in course
   * POST /api/admin/enrollments
   */
  static async enrollStudent(req: AuthenticatedRequest, res: Response) {
    try {
      const { student_id, course_id } = req.body;
      
      const connection = getPool();
      
      // Verify student exists and has student role
      const [student] = await connection.execute(
        'SELECT id FROM users WHERE id = ? AND role = "student"',
        [student_id]
      );

      if ((student as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Verify course exists
      const [course] = await connection.execute(
        'SELECT id FROM courses WHERE id = ?',
        [course_id]
      );

      if ((course as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if enrollment already exists
      const [existingEnrollment] = await connection.execute(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
        [student_id, course_id]
      );

      if ((existingEnrollment as RowDataPacket[]).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Student is already enrolled in this course'
        });
      }

      // Create enrollment
      await connection.execute(
        'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
        [student_id, course_id]
      );

      return res.json({
        success: true,
        message: 'Student enrolled successfully'
      });
    } catch (error) {
      console.error('Enroll student error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to enroll student'
      });
    }
  }

  /**
   * Remove student enrollment
   * DELETE /api/admin/enrollments/:enrollmentId
   */
  static async removeEnrollment(req: AuthenticatedRequest, res: Response) {
    try {
      const enrollmentId = req.params.enrollmentId;
      
      const connection = getPool();
      
      const [result] = await connection.execute(
        'DELETE FROM enrollments WHERE id = ?',
        [enrollmentId]
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found'
        });
      }

      return res.json({
        success: true,
        message: 'Enrollment removed successfully'
      });
    } catch (error) {
      console.error('Remove enrollment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove enrollment'
      });
    }
  }

  // ===== SYSTEM STATISTICS =====

  // ===== DETAILED VIEWS =====

  /**
   * Get teacher profile with assigned courses
   * GET /api/admin/teachers/:id/profile
   */
  static async getTeacherProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.params.id;
      const connection = getPool();
      
      // Get teacher details
      const [teacher] = await connection.execute(`
        SELECT 
          id,
          name,
          email,
          created_at
        FROM users 
        WHERE id = ? AND role = 'teacher'
      `, [teacherId]);

      if ((teacher as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Get assigned courses
      const [courses] = await connection.execute(`
        SELECT 
          c.id,
          c.title as course_name,
          c.course_code,
          c.description,
          c.credits,
          c.semester,
          c.academic_year,
          COUNT(DISTINCT e.user_id) as student_count
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.teacher_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `, [teacherId]);

      return res.json({
        success: true,
        data: {
          teacher: (teacher as RowDataPacket[])[0],
          courses: courses
        }
      });
    } catch (error) {
      console.error('Get teacher profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve teacher profile'
      });
    }
  }

  /**
   * Get student profile with enrolled courses
   * GET /api/admin/students/:id/profile
   */
  static async getStudentProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.params.id;
      const connection = getPool();
      
      // Get student details
      const [student] = await connection.execute(`
        SELECT 
          id,
          name,
          email,
          created_at
        FROM users 
        WHERE id = ? AND role = 'student'
      `, [studentId]);

      if ((student as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get enrolled courses
      const [courses] = await connection.execute(`
        SELECT 
          c.id,
          c.title as course_name,
          c.course_code,
          c.description,
          c.credits,
          c.semester,
          c.academic_year,
          u.name as teacher_name,
          e.enrolled_at
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE e.user_id = ?
        ORDER BY e.enrolled_at DESC
      `, [studentId]);

      return res.json({
        success: true,
        data: {
          student: (student as RowDataPacket[])[0],
          courses: courses
        }
      });
    } catch (error) {
      console.error('Get student profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve student profile'
      });
    }
  }

  /**
   * Get course details with enrolled students
   * GET /api/admin/courses/:id/details
   */
  static async getCourseDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const connection = getPool();
      
      // Get course details
      const [course] = await connection.execute(`
        SELECT 
          c.id,
          c.title as course_name,
          c.course_code,
          c.description,
          c.credits,
          c.semester,
          c.academic_year,
          c.color,
          c.created_at,
          u.name as teacher_name,
          u.email as teacher_email
        FROM courses c
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE c.id = ?
      `, [courseId]);

      if ((course as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Get enrolled students
      const [students] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          e.enrolled_at,
          e.id as enrollment_id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = ? AND u.role = 'student'
        ORDER BY u.name
      `, [courseId]);

      return res.json({
        success: true,
        data: {
          course: (course as RowDataPacket[])[0],
          students: students
        }
      });
    } catch (error) {
      console.error('Get course details error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve course details'
      });
    }
  }

  // ===== USER CREATION =====

  /**
   * Create a new teacher account
   * POST /api/admin/teachers
   */
  static async createTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, password } = req.body;
      const connection = getPool();
      
      // Check if email already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUser as RowDataPacket[]).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists in the system'
        });
      }

      // Hash the password
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create teacher account
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password_hash, role, created_at)
         VALUES (?, ?, ?, 'teacher', NOW())`,
        [name, email, hashedPassword]
      );

      const teacherId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Teacher account created successfully',
        data: {
          id: teacherId,
          name,
          email,
          role: 'teacher'
        }
      });
    } catch (error) {
      console.error('Create teacher error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create teacher account'
      });
    }
  }

  /**
   * Create a new student account
   * POST /api/admin/students
   */
  static async createStudent(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, password } = req.body;
      const connection = getPool();
      
      // Check if email already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUser as RowDataPacket[]).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists in the system'
        });
      }

      // Hash the password
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create student account
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password_hash, role, created_at)
         VALUES (?, ?, ?, 'student', NOW())`,
        [name, email, hashedPassword]
      );

      const studentId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Student account created successfully',
        data: {
          id: studentId,
          name,
          email,
          role: 'student'
        }
      });
    } catch (error) {
      console.error('Create student error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create student account'
      });
    }
  }

  /**
   * Get system statistics
   * GET /api/admin/stats
   */
  static async getSystemStats(req: AuthenticatedRequest, res: Response) {
    try {
      const connection = getPool();
      
      // Get user counts by role
      const [userStats] = await connection.execute(`
        SELECT 
          role,
          COUNT(*) as count
        FROM users
        GROUP BY role
      `);

      // Get course statistics
      const [courseStats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_courses,
          COUNT(DISTINCT teacher_id) as courses_with_teachers
        FROM courses
      `);

      // Get recent activity
      const [recentUsers] = await connection.execute(`
        SELECT COUNT(*) as count
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `);

      const [recentCourses] = await connection.execute(`
        SELECT COUNT(*) as count
        FROM courses
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `);

      // Get material statistics
      const [materialStats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_materials,
          COUNT(DISTINCT section_id) as sections_with_materials
        FROM materials
      `);

      res.json({
        success: true,
        data: {
          users: userStats,
          courses: (courseStats as RowDataPacket[])[0],
          materials: (materialStats as RowDataPacket[])[0],
          recent_activity: {
            new_users_week: (recentUsers as RowDataPacket[])[0].count,
            new_courses_week: (recentCourses as RowDataPacket[])[0].count
          }
        }
      });
    } catch (error) {
      console.error('Get system stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system statistics'
      });
    }
  }
}