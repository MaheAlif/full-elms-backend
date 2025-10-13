import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { getPool } from '../utils/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class TeacherController {
  
  // ===== COURSE MANAGEMENT =====
  
  /**
   * Get teacher's assigned courses
   * GET /api/teacher/courses
   */
  static async getCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
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
          COUNT(DISTINCT e.user_id) as student_count,
          COUNT(DISTINCT s.id) as section_count,
          COUNT(DISTINCT m.id) as material_count
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN sections s ON c.id = s.course_id
        LEFT JOIN materials m ON s.id = m.section_id
        WHERE c.teacher_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `, [teacherId]);

      return res.json({
        success: true,
        data: { courses }
      });
    } catch (error) {
      console.error('Get teacher courses error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve courses'
      });
    }
  }

  /**
   * Get course details with sections and students
   * GET /api/teacher/courses/:id/details
   */
  static async getCourseDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const teacherId = req.user!.userId;
      const connection = getPool();
      
      // Verify teacher owns this course
      const [ownershipCheck] = await connection.execute(
        'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
        [courseId, teacherId]
      );

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Course not assigned to you'
        });
      }

      // Get course details
      const [courseDetails] = await connection.execute(`
        SELECT 
          c.id,
          c.title as course_name,
          c.course_code,
          c.description,
          c.credits,
          c.semester,
          c.academic_year,
          c.color,
          c.created_at
        FROM courses c
        WHERE c.id = ?
      `, [courseId]);

      // Get enrolled students
      const [students] = await connection.execute(`
        SELECT 
          u.id,
          u.name,
          u.email,
          e.enrolled_at
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = ? AND u.role = 'student'
        ORDER BY u.name
      `, [courseId]);

      // Get sections for this course
      const [sections] = await connection.execute(`
        SELECT 
          s.id,
          s.name,
          COUNT(DISTINCT m.id) as material_count
        FROM sections s
        LEFT JOIN materials m ON s.id = m.section_id
        WHERE s.course_id = ?
        GROUP BY s.id
        ORDER BY s.name
      `, [courseId]);

      return res.json({
        success: true,
        data: {
          course: (courseDetails as RowDataPacket[])[0],
          students,
          sections
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

  // ===== STUDENT MANAGEMENT =====
  
  /**
   * Get students enrolled in teacher's courses
   * GET /api/teacher/students
   */
  static async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const connection = getPool();
      
      let query = `
        SELECT DISTINCT
          u.id,
          u.name,
          u.email,
          c.title as course_name,
          c.course_code,
          e.enrolled_at
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
        JOIN courses c ON e.course_id = c.id
        WHERE c.teacher_id = ? AND u.role = 'student'
      `;
      
      const params: any[] = [teacherId];
      
      if (courseId) {
        query += ' AND c.id = ?';
        params.push(courseId);
      }
      
      query += ' ORDER BY c.course_code, u.name';
      
      const [students] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { students }
      });
    } catch (error) {
      console.error('Get teacher students error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve students'
      });
    }
  }

  // ===== MATERIAL MANAGEMENT =====
  
  /**
   * Get materials for teacher's courses
   * GET /api/teacher/materials
   */
  static async getMaterials(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const sectionId = req.query.section_id as string;
      const connection = getPool();
      
      let query = `
        SELECT 
          m.id,
          m.title,
          m.type,
          m.file_path,
          m.size as file_size,
          m.upload_date as uploaded_at,
          s.name as section_name,
          c.title as course_name,
          c.course_code
        FROM materials m
        JOIN sections s ON m.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE c.teacher_id = ?
      `;
      
      const params: any[] = [teacherId];
      
      if (courseId) {
        query += ' AND c.id = ?';
        params.push(courseId);
      }
      
      if (sectionId) {
        query += ' AND s.id = ?';
        params.push(sectionId);
      }
      
      query += ' ORDER BY m.upload_date DESC';
      
      const [materials] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { materials }
      });
    } catch (error) {
      console.error('Get materials error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve materials'
      });
    }
  }

  /**
   * Upload material to section
   * POST /api/teacher/materials/upload
   */
  static async uploadMaterial(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const { section_id, title, type } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const connection = getPool();
      
      // Verify teacher owns the course for this section
      const [ownershipCheck] = await connection.execute(`
        SELECT c.id 
        FROM courses c
        JOIN sections s ON c.id = s.course_id
        WHERE s.id = ? AND c.teacher_id = ?
      `, [section_id, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Section not in your course'
        });
      }

      // Insert material record
      const [result] = await connection.execute(`
        INSERT INTO materials (section_id, title, type, file_path, size)
        VALUES (?, ?, ?, ?, ?)
      `, [section_id, title, type, file.path, file.size?.toString()]);

      const materialId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Material uploaded successfully',
        data: {
          id: materialId,
          title,
          type,
          file_path: file.path,
          size: file.size?.toString()
        }
      });
    } catch (error) {
      console.error('Upload material error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload material'
      });
    }
  }

  /**
   * Delete material
   * DELETE /api/teacher/materials/:id
   */
  static async deleteMaterial(req: AuthenticatedRequest, res: Response) {
    try {
      const materialId = req.params.id;
      const teacherId = req.user!.userId;
      const connection = getPool();
      
      // Verify teacher owns the material
      const [ownershipCheck] = await connection.execute(`
        SELECT m.id, m.file_path
        FROM materials m
        JOIN sections s ON m.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE m.id = ? AND c.teacher_id = ?
      `, [materialId, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Material not in your course'
        });
      }

      // Delete material record
      await connection.execute('DELETE FROM materials WHERE id = ?', [materialId]);

      // TODO: Delete physical file from filesystem
      // const filePath = (ownershipCheck as RowDataPacket[])[0].file_path;
      // fs.unlinkSync(filePath);

      return res.json({
        success: true,
        message: 'Material deleted successfully'
      });
    } catch (error) {
      console.error('Delete material error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete material'
      });
    }
  }

  // ===== ASSIGNMENT MANAGEMENT =====
  
  /**
   * Get assignments for teacher's courses
   * GET /api/teacher/assignments
   */
  static async getAssignments(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const connection = getPool();
      
      let query = `
        SELECT 
          a.id,
          a.title,
          a.description,
          a.due_date,
          a.total_marks,
          a.created_at,
          s.name as section_name,
          c.title as course_name,
          c.course_code,
          COUNT(DISTINCT sub.id) as submission_count,
          COUNT(DISTINCT e.user_id) as total_students
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        LEFT JOIN submissions sub ON a.id = sub.assignment_id
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.teacher_id = ?
      `;
      
      const params: any[] = [teacherId];
      
      if (courseId) {
        query += ' AND c.id = ?';
        params.push(courseId);
      }
      
      query += ' GROUP BY a.id ORDER BY a.due_date DESC';
      
      const [assignments] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { assignments }
      });
    } catch (error) {
      console.error('Get assignments error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve assignments'
      });
    }
  }

  /**
   * Create new assignment
   * POST /api/teacher/assignments
   */
  static async createAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const { section_id, title, description, due_date, total_marks } = req.body;
      const connection = getPool();
      
      // Verify teacher owns the course for this section
      const [ownershipCheck] = await connection.execute(`
        SELECT c.id 
        FROM courses c
        JOIN sections s ON c.id = s.course_id
        WHERE s.id = ? AND c.teacher_id = ?
      `, [section_id, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Section not in your course'
        });
      }

      // Create assignment
      const [result] = await connection.execute(`
        INSERT INTO assignments (section_id, title, description, due_date, total_marks)
        VALUES (?, ?, ?, ?, ?)
      `, [section_id, title, description, due_date, total_marks]);

      const assignmentId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        data: {
          id: assignmentId,
          title,
          description,
          due_date,
          total_marks
        }
      });
    } catch (error) {
      console.error('Create assignment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create assignment'
      });
    }
  }

  /**
   * Update assignment
   * PUT /api/teacher/assignments/:id
   */
  static async updateAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const assignmentId = req.params.id;
      const teacherId = req.user!.userId;
      const { title, description, due_date, total_marks } = req.body;
      const connection = getPool();
      
      // Verify teacher owns the assignment
      const [ownershipCheck] = await connection.execute(`
        SELECT a.id
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE a.id = ? AND c.teacher_id = ?
      `, [assignmentId, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Assignment not in your course'
        });
      }

      // Update assignment
      await connection.execute(`
        UPDATE assignments 
        SET title = ?, description = ?, due_date = ?, total_marks = ?
        WHERE id = ?
      `, [title, description, due_date, total_marks, assignmentId]);

      return res.json({
        success: true,
        message: 'Assignment updated successfully'
      });
    } catch (error) {
      console.error('Update assignment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update assignment'
      });
    }
  }

  /**
   * Delete assignment
   * DELETE /api/teacher/assignments/:id
   */
  static async deleteAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const assignmentId = req.params.id;
      const teacherId = req.user!.userId;
      const connection = getPool();
      
      // Verify teacher owns the assignment
      const [ownershipCheck] = await connection.execute(`
        SELECT a.id
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE a.id = ? AND c.teacher_id = ?
      `, [assignmentId, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Assignment not in your course'
        });
      }

      // Delete assignment (submissions will be cascade deleted)
      await connection.execute('DELETE FROM assignments WHERE id = ?', [assignmentId]);

      return res.json({
        success: true,
        message: 'Assignment deleted successfully'
      });
    } catch (error) {
      console.error('Delete assignment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete assignment'
      });
    }
  }

  // ===== GRADING SYSTEM =====
  
  /**
   * Get submissions for an assignment
   * GET /api/teacher/assignments/:id/submissions
   */
  static async getAssignmentSubmissions(req: AuthenticatedRequest, res: Response) {
    try {
      const assignmentId = req.params.id;
      const teacherId = req.user!.userId;
      const connection = getPool();
      
      // Verify teacher owns the assignment and get assignment details
      const [assignmentCheck] = await connection.execute(`
        SELECT 
          a.id, 
          a.title, 
          a.description,
          a.due_date,
          a.total_marks,
          c.id as course_id,
          c.title as course_name,
          c.course_code,
          s.name as section_name
        FROM assignments a
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE a.id = ? AND c.teacher_id = ?
      `, [assignmentId, teacherId]);

      if ((assignmentCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Assignment not in your course'
        });
      }

      const assignment = (assignmentCheck as RowDataPacket[])[0];

      // Get all enrolled students and their submission status
      const [studentsWithSubmissions] = await connection.execute(`
        SELECT 
          u.id as student_id,
          u.name as student_name,
          u.email as student_email,
          sub.id as submission_id,
          sub.file_path,
          sub.submitted_at,
          sub.grade,
          sub.feedback,
          sub.graded_at,
          CASE 
            WHEN sub.id IS NOT NULL THEN 'submitted'
            WHEN ? < NOW() THEN 'overdue'
            ELSE 'pending'
          END as status,
          CASE 
            WHEN sub.id IS NOT NULL AND sub.submitted_at > ? THEN 
              CEIL(TIMESTAMPDIFF(HOUR, ?, sub.submitted_at) / 24)
            ELSE 0
          END as days_late
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN sections s ON e.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        JOIN assignments a ON s.id = a.section_id
        LEFT JOIN submissions sub ON a.id = sub.assignment_id AND u.id = sub.student_id
        WHERE a.id = ? AND u.role = 'student'
        ORDER BY u.name ASC
      `, [assignment.due_date, assignment.due_date, assignment.due_date, assignmentId]);

      // Calculate submission statistics
      const totalStudents = (studentsWithSubmissions as RowDataPacket[]).length;
      const submittedCount = (studentsWithSubmissions as RowDataPacket[]).filter(s => s.submission_id).length;
      const gradedCount = (studentsWithSubmissions as RowDataPacket[]).filter(s => s.grade !== null).length;
      const overdueCount = (studentsWithSubmissions as RowDataPacket[]).filter(s => s.status === 'overdue').length;

      return res.json({
        success: true,
        data: {
          assignment: {
            ...assignment,
            statistics: {
              total_students: totalStudents,
              submitted_count: submittedCount,
              graded_count: gradedCount,
              overdue_count: overdueCount,
              pending_count: totalStudents - submittedCount
            }
          },
          students: studentsWithSubmissions
        }
      });
    } catch (error) {
      console.error('Get assignment submissions error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve submissions'
      });
    }
  }

  /**
   * Download student submission file
   * GET /api/teacher/submissions/:id/download
   */
  static async downloadSubmission(req: AuthenticatedRequest, res: Response) {
    try {
      const submissionId = req.params.id;
      const teacherId = req.user!.userId;
      const connection = getPool();
      
      // Verify teacher owns the assignment and get file details
      const [submissionCheck] = await connection.execute(`
        SELECT 
          sub.id,
          sub.file_path,
          sub.submitted_at,
          u.name as student_name,
          a.title as assignment_title
        FROM submissions sub
        JOIN users u ON sub.student_id = u.id
        JOIN assignments a ON sub.assignment_id = a.id
        JOIN sections s ON a.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE sub.id = ? AND c.teacher_id = ?
      `, [submissionId, teacherId]);

      if ((submissionCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Submission not in your course'
        });
      }

      const submission = (submissionCheck as RowDataPacket[])[0];
      const filePath = submission.file_path;

      // Check if file exists
      const fs = require('fs');
      const path = require('path');
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Submission file not found'
        });
      }

      // Set appropriate headers for file download
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(fileName);
      const downloadName = `${submission.student_name}_${submission.assignment_title}${fileExtension}`;

      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error: any) => {
        console.error('File download error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        }
      });

      // Return after setting up the stream
      return;

    } catch (error) {
      console.error('Download submission error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to download submission'
      });
    }
  }

  /**
   * Grade a submission
   * PUT /api/teacher/submissions/:id/grade
   */
  static async gradeSubmission(req: AuthenticatedRequest, res: Response) {
    try {
      const submissionId = req.params.id;
      const teacherId = req.user!.userId;
      const { grade, feedback } = req.body;
      const connection = getPool();
      
      // Verify teacher owns the assignment
      const [ownershipCheck] = await connection.execute(`
        SELECT s.id
        FROM submissions s
        JOIN assignments a ON s.assignment_id = a.id
        JOIN sections sec ON a.section_id = sec.id
        JOIN courses c ON sec.course_id = c.id
        WHERE s.id = ? AND c.teacher_id = ?
      `, [submissionId, teacherId]);

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Submission not in your course'
        });
      }

      // Update grade with feedback and timestamp
      await connection.execute(`
        UPDATE submissions 
        SET grade = ?, feedback = ?, graded_at = NOW(), graded_by = ?
        WHERE id = ?
      `, [grade, feedback, teacherId, submissionId]);

      return res.json({
        success: true,
        message: 'Submission graded successfully'
      });
    } catch (error) {
      console.error('Grade submission error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to grade submission'
      });
    }
  }

  // ===== SECTIONS MANAGEMENT =====
  
  /**
   * Get sections for teacher's courses
   * GET /api/teacher/sections
   */
  static async getSections(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const courseId = req.query.course_id as string;
      const connection = getPool();
      
      let query = `
        SELECT 
          s.id,
          s.name,
          s.course_id,
          c.title as course_name,
          c.course_code,
          COUNT(DISTINCT m.id) as material_count,
          COUNT(DISTINCT a.id) as assignment_count
        FROM sections s
        JOIN courses c ON s.course_id = c.id
        LEFT JOIN materials m ON s.id = m.section_id
        LEFT JOIN assignments a ON s.id = a.section_id
        WHERE c.teacher_id = ?
      `;
      
      const params: any[] = [teacherId];
      
      if (courseId) {
        query += ' AND c.id = ?';
        params.push(courseId);
      }
      
      query += ' GROUP BY s.id ORDER BY c.course_code, s.name';
      
      const [sections] = await connection.execute(query, params);

      return res.json({
        success: true,
        data: { sections }
      });
    } catch (error) {
      console.error('Get sections error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve sections'
      });
    }
  }

  /**
   * Create new section
   * POST /api/teacher/sections
   */
  static async createSection(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.userId;
      const { course_id, name } = req.body;
      const connection = getPool();
      
      // Verify teacher owns the course
      const [ownershipCheck] = await connection.execute(
        'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
        [course_id, teacherId]
      );

      if ((ownershipCheck as RowDataPacket[]).length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Course not assigned to you'
        });
      }

      // Create section
      const [result] = await connection.execute(
        'INSERT INTO sections (course_id, name) VALUES (?, ?)',
        [course_id, name]
      );

      const sectionId = (result as ResultSetHeader).insertId;

      return res.status(201).json({
        success: true,
        message: 'Section created successfully',
        data: {
          id: sectionId,
          course_id,
          name
        }
      });
    } catch (error) {
      console.error('Create section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create section'
      });
    }
  }
}