import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { getPool } from '../utils/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as fs from 'fs';
import * as path from 'path';

export class StudentController {
  
  // ===== COURSE MANAGEMENT =====
  
  /**
   * Get student's enrolled courses
   * GET /api/student/courses
   */
  static async getCourses(req: AuthenticatedRequest, res: Response) {
    console.log('🎯 StudentController.getCourses called for user:', req.user?.userId);
    try {
      const studentId = req.user!.userId;
      const connection = getPool();
      
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
          c.created_at,
          u.name as teacher_name,
          u.email as teacher_email,
          COUNT(DISTINCT m.id) as material_count,
          COUNT(DISTINCT a.id) as assignment_count,
          COUNT(DISTINCT s.id) as submission_count
        FROM enrollments e
        LEFT JOIN sections sec ON e.section_id = sec.id
        LEFT JOIN courses c ON (sec.course_id = c.id OR e.course_id = c.id)
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN materials m ON sec.id = m.section_id
        LEFT JOIN assignments a ON sec.id = a.section_id
        LEFT JOIN submissions s ON a.id = s.assignment_id AND e.user_id = s.student_id
        WHERE e.user_id = ? AND c.id IS NOT NULL
        GROUP BY c.id, u.id
        ORDER BY c.created_at DESC
      `, [studentId]);

      return res.json({
        success: true,
        data: { courses }
      });
    } catch (error) {
      console.error('Get student courses error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve courses'
      });
    }
  }

  /**
   * Get course details for student
   * GET /api/student/courses/:id/details
   */
  static async getCourseDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const courseId = req.params.id;
      const connection = getPool();

      // Verify student is enrolled in this course
      const [enrollment] = await connection.execute(`
        SELECT id FROM enrollments 
        WHERE user_id = ? AND course_id = ?
      `, [studentId, courseId]);

      if ((enrollment as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course'
        });
      }

      const [courseDetails] = await connection.execute(`
        SELECT 
          c.*,
          u.name as teacher_name,
          u.email as teacher_email,
          COUNT(DISTINCT e.user_id) as enrolled_students,
          COUNT(DISTINCT m.id) as total_materials,
          COUNT(DISTINCT a.id) as total_assignments
        FROM courses c
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN sections sec ON c.id = sec.course_id
        LEFT JOIN materials m ON sec.id = m.section_id
        LEFT JOIN assignments a ON sec.id = a.section_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [courseId]);

      if ((courseDetails as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      return res.json({
        success: true,
        data: { course: (courseDetails as RowDataPacket[])[0] }
      });
    } catch (error) {
      console.error('Get course details error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve course details'
      });
    }
  }

  // ===== MATERIALS MANAGEMENT =====
  
  /**
   * Get materials for student's courses
   * GET /api/student/materials?course_id=1
   */
  static async getMaterials(req: AuthenticatedRequest, res: Response) {
    console.log('🎯 StudentController.getMaterials called for user:', req.user?.userId);
    try {
      const studentId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const connection = getPool();
      
      let query = `
        SELECT DISTINCT
          m.id,
          m.title,
          m.type,
          m.file_path,
          m.size,
          m.upload_date,
          c.title as course_name,
          c.course_code,
          c.id as course_id,
          u.name as uploaded_by
        FROM materials m
        LEFT JOIN sections s ON m.section_id = s.id
        LEFT JOIN courses c ON s.course_id = c.id
        JOIN enrollments e ON (s.id = e.section_id OR c.id = e.course_id)
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE e.user_id = ? AND c.id IS NOT NULL
      `;
      
      const params: any[] = [studentId];
      
      if (courseId) {
        query += ` AND c.id = ?`;
        params.push(courseId);
      }
      
      query += ` ORDER BY m.upload_date DESC`;
      
      const [materials] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { materials }
      });
    } catch (error) {
      console.error('Get student materials error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve materials'
      });
    }
  }

  // ===== ASSIGNMENT MANAGEMENT =====
  
  /**
   * Get assignments for student's courses
   * GET /api/student/assignments?course_id=1
   */
  static async getAssignments(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const connection = getPool();
      
      let query = `
        SELECT DISTINCT
          a.id,
          a.title,
          a.description,
          a.due_date,
          a.total_marks,
          a.created_at,
          c.title as course_name,
          c.course_code,
          c.id as course_id,
          s.id as submission_id,
          s.file_path as submission_file,
          s.submitted_at,
          s.grade,
          s.feedback,
          s.graded_at,
          CASE 
            WHEN s.id IS NOT NULL THEN 'submitted'
            WHEN a.due_date < NOW() THEN 'overdue'
            ELSE 'pending'
          END as status,
          DATEDIFF(a.due_date, NOW()) as days_remaining
        FROM assignments a
        LEFT JOIN sections sec ON a.section_id = sec.id
        LEFT JOIN courses c ON sec.course_id = c.id
        JOIN enrollments e ON (sec.id = e.section_id OR c.id = e.course_id)
        LEFT JOIN submissions s ON a.id = s.assignment_id AND e.user_id = s.student_id
        WHERE e.user_id = ? AND c.id IS NOT NULL
      `;
      
      const params: any[] = [studentId];
      
      if (courseId) {
        query += ` AND c.id = ?`;
        params.push(courseId);
      }
      
      query += ` ORDER BY a.due_date ASC`;
      
      const [assignments] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { assignments }
      });
    } catch (error) {
      console.error('Get student assignments error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve assignments'
      });
    }
  }

  /**
   * Submit assignment
   * POST /api/student/assignments/:id/submit
   */
  static async submitAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const assignmentId = req.params.id;
      const { title, description } = req.body;
      const file = req.file;
      const connection = getPool();

      // Verify assignment exists and student can submit
      const [assignment] = await connection.execute(`
        SELECT 
          a.id,
          a.due_date,
          a.title as assignment_title,
          c.title as course_name
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        JOIN enrollments e ON (s.id = e.section_id OR c.id = e.course_id)
        WHERE a.id = ? AND e.user_id = ?
      `, [assignmentId, studentId]);

      if ((assignment as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found or you are not enrolled in this course'
        });
      }

      const assignmentData = (assignment as RowDataPacket[])[0];

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file for your submission'
        });
      }

      // Calculate if submission is late
      const dueDate = new Date(assignmentData.due_date);
      const currentTime = new Date();
      const isLate = currentTime > dueDate;
      const daysLate = isLate ? Math.ceil((currentTime.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      // Check if already submitted
      const [existingSubmission] = await connection.execute(`
        SELECT id FROM submissions 
        WHERE assignment_id = ? AND student_id = ?
      `, [assignmentId, studentId]);

      let submissionId;
      let isUpdate = false;
      let successMessage = 'Assignment submitted successfully';

      if ((existingSubmission as RowDataPacket[]).length > 0) {
        // Update existing submission (allow resubmission)
        submissionId = (existingSubmission as RowDataPacket[])[0].id;
        isUpdate = true;
        
        await connection.execute(`
          UPDATE submissions 
          SET file_path = ?, submitted_at = NOW()
          WHERE id = ?
        `, [file.path, submissionId]);
        
        successMessage = isLate 
          ? `Assignment resubmitted successfully (${daysLate} days late)`
          : 'Assignment resubmitted successfully';
      } else {
        // Create new submission
        const [result] = await connection.execute(`
          INSERT INTO submissions (
            assignment_id, 
            student_id, 
            file_path, 
            submitted_at
          ) VALUES (?, ?, ?, NOW())
        `, [
          assignmentId,
          studentId,
          file.path
        ]);

        submissionId = (result as ResultSetHeader).insertId;
        
        successMessage = isLate 
          ? `Assignment submitted successfully (${daysLate} days late)`
          : 'Assignment submitted successfully';
      }

      return res.status(201).json({
        success: true,
        message: successMessage,
        data: {
          submission_id: submissionId,
          assignment_title: assignmentData.assignment_title,
          course_name: assignmentData.course_name,
          submitted_at: new Date().toISOString(),
          is_late: isLate,
          days_late: isLate ? daysLate : 0,
          is_resubmission: isUpdate
        }
      });

    } catch (error) {
      console.error('Submit assignment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit assignment'
      });
    }
  }

  /**
   * Get assignment details for submission
   * GET /api/student/assignments/:id
   */
  static async getAssignmentDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const assignmentId = req.params.id;
      const connection = getPool();

      const [assignment] = await connection.execute(`
        SELECT 
          a.*,
          c.title as course_name,
          c.course_code,
          s.title as submission_title,
          s.file_path as submission_file,
          s.submitted_at,
          s.grade,
          s.feedback,
          s.graded_at,
          CASE 
            WHEN s.id IS NOT NULL THEN 'submitted'
            WHEN a.due_date < NOW() THEN 'overdue'
            ELSE 'pending'
          END as status
        FROM assignments a
        JOIN sections sec ON a.section_id = sec.id
        JOIN courses c ON sec.course_id = c.id
        JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN submissions s ON a.id = s.assignment_id AND e.user_id = s.student_id
        WHERE a.id = ? AND e.user_id = ?
      `, [assignmentId, studentId]);

      if ((assignment as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found or you are not enrolled in this course'
        });
      }

      return res.json({
        success: true,
        data: { assignment: (assignment as RowDataPacket[])[0] }
      });
    } catch (error) {
      console.error('Get assignment details error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve assignment details'
      });
    }
  }

  // ===== CALENDAR MANAGEMENT =====
  
  /**
   * Get calendar events for student
   * GET /api/student/calendar
   */
  static async getCalendar(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const connection = getPool();
      
      const [events] = await connection.execute(`
        SELECT 
          'assignment' as type,
          a.id,
          a.title,
          a.description,
          a.due_date as date,
          c.title as course_name,
          c.course_code,
          c.color as course_color,
          CASE 
            WHEN s.id IS NOT NULL THEN 'submitted'
            WHEN a.due_date < NOW() THEN 'overdue'
            ELSE 'pending'
          END as status
        FROM assignments a
        LEFT JOIN sections sec ON a.section_id = sec.id
        LEFT JOIN courses c ON sec.course_id = c.id
        JOIN enrollments e ON (sec.id = e.section_id OR c.id = e.course_id)
        LEFT JOIN submissions s ON a.id = s.assignment_id AND e.user_id = s.student_id
        WHERE e.user_id = ? AND c.id IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'event' as type,
          ce.id,
          ce.title,
          ce.description,
          ce.date,
          c.title as course_name,
          c.course_code,
          c.color as course_color,
          ce.type as status
        FROM calendar_events ce
        LEFT JOIN sections sec ON ce.section_id = sec.id
        LEFT JOIN courses c ON sec.course_id = c.id
        JOIN enrollments e ON (sec.id = e.section_id OR c.id = e.course_id)
        WHERE e.user_id = ? AND c.id IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'university_event' as type,
          ue.id,
          ue.title,
          ue.description,
          ue.date,
          'University-wide' as course_name,
          'ALL' as course_code,
          CASE ue.priority 
            WHEN 'high' THEN '#dc2626'
            WHEN 'normal' THEN '#9333ea'
            ELSE '#6b7280'
          END as course_color,
          ue.type as status
        FROM university_events ue
        WHERE ue.date >= CURDATE() - INTERVAL 30 DAY
        
        ORDER BY date ASC
      `, [studentId, studentId]);

      return res.json({
        success: true,
        data: { events }
      });
    } catch (error) {
      console.error('Get student calendar error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve calendar events'
      });
    }
  }

  // ===== FILE DOWNLOAD =====
  
  /**
   * Download material file
   * GET /api/student/materials/:id/download
   */
  static async downloadMaterial(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!.userId;
      const materialId = req.params.id;
      const connection = getPool();

      // Verify student has access to this material
      const [material] = await connection.execute(`
        SELECT 
          m.id,
          m.title,
          m.file_path,
          m.type,
          c.title as course_name
        FROM materials m
        JOIN sections s ON m.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        JOIN enrollments e ON (s.id = e.section_id OR c.id = e.course_id)
        WHERE m.id = ? AND e.user_id = ?
      `, [materialId, studentId]);

      if ((material as RowDataPacket[]).length === 0) {
        res.status(404).json({
          success: false,
          message: 'Material not found or access denied'
        });
        return;
      }

      const materialData = (material as RowDataPacket[])[0];
      
      // Extract filename from the stored path (handle both absolute and relative paths)
      let filename = materialData.file_path;
      
      // If it's an absolute path, extract just the filename
      if (path.isAbsolute(filename)) {
        filename = path.basename(filename);
      }
      
      // Construct the relative path
      const relativePath = `materials/${filename}`;
      const filePath = path.join(__dirname, '../../uploads', relativePath);

      console.log('📁 Attempting to download file:', {
        materialId,
        title: materialData.title,
        stored_file_path: materialData.file_path,
        extracted_filename: filename,
        constructed_relative_path: relativePath,
        final_full_path: filePath,
        file_exists: fs.existsSync(filePath)
      });

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error('❌ File not found:', filePath);
        res.status(404).json({
          success: false,
          message: `File not found on server: ${materialData.file_path}`
        });
        return;
      }

      // Get file stats for better headers
      const stats = fs.statSync(filePath);
      const fileExtension = path.extname(materialData.file_path).toLowerCase();
      
      // Set Content-Type based on file extension
      let contentType = 'application/octet-stream';
      if (fileExtension === '.pdf') {
        contentType = 'application/pdf';
      } else if (fileExtension === '.docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (fileExtension === '.pptx') {
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      }

      // Set appropriate headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${materialData.title}"`);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stats.size);

      console.log('✅ Streaming file:', materialData.title);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      // Return void to satisfy TypeScript
      return;

    } catch (error) {
      console.error('Download material error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download material'
      });
      return;
    }
  }

  // ===== PROFILE MANAGEMENT =====
  
  /**
   * Get student profile
   * GET /api/student/profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const connection = getPool();
      
      const [profile] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.avatar_url,
          u.created_at,
          COUNT(DISTINCT e.course_id) as enrolled_courses,
          COUNT(DISTINCT s.id) as total_submissions,
          AVG(s.grade) as average_grade,
          COUNT(DISTINCT CASE WHEN s.grade IS NOT NULL THEN s.id END) as graded_submissions
        FROM users u
        LEFT JOIN enrollments e ON u.id = e.user_id
        LEFT JOIN submissions s ON u.id = s.student_id
        WHERE u.id = ? AND u.role = 'student'
        GROUP BY u.id
      `, [studentId]);

      if ((profile as RowDataPacket[]).length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      return res.json({
        success: true,
        data: { profile: (profile as RowDataPacket[])[0] }
      });
    } catch (error) {
      console.error('Get student profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }

  // ===== NOTIFICATIONS MANAGEMENT =====

  /**
   * Get student notifications
   * GET /api/student/notifications
   */
  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const { page = 1, limit = 20, unread_only = false } = req.query;
      const connection = getPool();
      
      let whereClause = 'WHERE n.user_id = ?';
      let queryParams = [studentId];
      
      if (unread_only === 'true') {
        whereClause += ' AND n.read_status = FALSE';
      }
      
      queryParams.push(Number(limit), (Number(page) - 1) * Number(limit));
      
      const [notifications] = await connection.execute(`
        SELECT 
          n.id,
          n.type,
          n.message,
          n.read_status,
          n.created_at
        FROM notifications n
        ${whereClause}
        ORDER BY n.created_at DESC
        LIMIT ? OFFSET ?
      `, queryParams);

      // Get unread count
      const [unreadCount] = await connection.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_status = FALSE',
        [studentId]
      );

      return res.json({
        success: true,
        data: { 
          notifications,
          unread_count: (unreadCount as RowDataPacket[])[0].count
        }
      });
    } catch (error) {
      console.error('Get student notifications error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications'
      });
    }
  }

  /**
   * Mark notification as read
   * PUT /api/student/notifications/:id/read
   */
  static async markNotificationRead(req: AuthenticatedRequest, res: Response) {
    try {
      const notificationId = req.params.id;
      const studentId = req.user!.userId;
      const connection = getPool();
      
      await connection.execute(
        'UPDATE notifications SET read_status = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, studentId]
      );

      return res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Mark notification read error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  }

  /**
   * Mark all notifications as read
   * PUT /api/student/notifications/mark-all-read
   */
  static async markAllNotificationsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.userId;
      const connection = getPool();
      
      await connection.execute(
        'UPDATE notifications SET read_status = TRUE WHERE user_id = ? AND read_status = FALSE',
        [studentId]
      );

      return res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Mark all notifications read error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  }
}