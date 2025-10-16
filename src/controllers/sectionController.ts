import { Response } from 'express';
import { getPool } from '../utils/database';
import { AuthenticatedRequest } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * Section Controller
 * Handles section management operations for admin
 */
export class SectionController {
  
  /**
   * Create a new section for a course
   * POST /api/admin/sections
   */
  static async createSection(req: AuthenticatedRequest, res: Response) {
    try {
      const { course_id, name, teacher_id, max_capacity } = req.body;

      const pool = getPool();

      // Verify course exists
      const [courses] = await pool.execute<RowDataPacket[]>(
        'SELECT id, course_code, title FROM courses WHERE id = ?',
        [course_id]
      );

      if (courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Verify teacher if provided
      if (teacher_id) {
        const [teachers] = await pool.execute<RowDataPacket[]>(
          'SELECT id FROM users WHERE id = ? AND role = "teacher"',
          [teacher_id]
        );

        if (teachers.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Teacher not found'
          });
        }
      }

      // Check if section with same name already exists for this course
      const [existing] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM sections WHERE course_id = ? AND name = ?',
        [course_id, name]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'A section with this name already exists for this course'
        });
      }

      // Create section
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO sections (course_id, teacher_id, name, max_capacity, current_enrollment) 
         VALUES (?, ?, ?, ?, 0)`,
        [course_id, teacher_id || null, name, max_capacity || 50]
      );

      const sectionId = result.insertId;

      // Fetch the created section with details
      const [newSection] = await pool.execute<RowDataPacket[]>(
        `SELECT s.*, c.course_code, c.title as course_title, u.name as teacher_name
         FROM sections s
         JOIN courses c ON s.course_id = c.id
         LEFT JOIN users u ON s.teacher_id = u.id
         WHERE s.id = ?`,
        [sectionId]
      );

      return res.status(201).json({
        success: true,
        message: 'Section created successfully',
        data: newSection[0]
      });

    } catch (error) {
      console.error('Create section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create section'
      });
    }
  }

  /**
   * Get all sections (with optional course filter)
   * GET /api/admin/sections?course_id=1
   */
  static async getSections(req: AuthenticatedRequest, res: Response) {
    try {
      const courseId = req.query.course_id as string;
      const pool = getPool();

      let query = `
        SELECT s.*, 
               c.course_code, c.title as course_title,
               u.name as teacher_name, u.email as teacher_email
        FROM sections s
        JOIN courses c ON s.course_id = c.id
        LEFT JOIN users u ON s.teacher_id = u.id
      `;
      const params: any[] = [];

      if (courseId) {
        query += ' WHERE s.course_id = ?';
        params.push(courseId);
      }

      query += ' ORDER BY c.course_code, s.name';

      const [sections] = await pool.execute<RowDataPacket[]>(query, params);

      return res.json({
        success: true,
        data: sections
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
   * Get section details with enrolled students
   * GET /api/admin/sections/:id
   */
  static async getSectionDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const pool = getPool();

      // Get section details
      const [sections] = await pool.execute<RowDataPacket[]>(
        `SELECT s.*, 
                c.course_code, c.title as course_title, c.description as course_description,
                u.name as teacher_name, u.email as teacher_email
         FROM sections s
         JOIN courses c ON s.course_id = c.id
         LEFT JOIN users u ON s.teacher_id = u.id
         WHERE s.id = ?`,
        [id]
      );

      if (sections.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }

      const section = sections[0];

      // Get enrolled students
      const [students] = await pool.execute<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, u.avatar_url, e.enrolled_at
         FROM enrollments e
         JOIN users u ON e.user_id = u.id
         WHERE e.section_id = ?
         ORDER BY u.name`,
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...section,
          students
        }
      });

    } catch (error) {
      console.error('Get section details error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve section details'
      });
    }
  }

  /**
   * Update section details
   * PUT /api/admin/sections/:id
   */
  static async updateSection(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, teacher_id, max_capacity } = req.body;

      const pool = getPool();

      // Verify section exists
      const [sections] = await pool.execute<RowDataPacket[]>(
        'SELECT id, course_id FROM sections WHERE id = ?',
        [id]
      );

      if (sections.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }

      // Verify teacher if provided
      if (teacher_id) {
        const [teachers] = await pool.execute<RowDataPacket[]>(
          'SELECT id FROM users WHERE id = ? AND role = "teacher"',
          [teacher_id]
        );

        if (teachers.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Teacher not found'
          });
        }
      }

      // Build update query
      const updates: string[] = [];
      const params: any[] = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (teacher_id !== undefined) {
        updates.push('teacher_id = ?');
        params.push(teacher_id || null);
      }
      if (max_capacity !== undefined) {
        updates.push('max_capacity = ?');
        params.push(max_capacity);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      params.push(id);

      await pool.execute(
        `UPDATE sections SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      // Fetch updated section
      const [updated] = await pool.execute<RowDataPacket[]>(
        `SELECT s.*, c.course_code, c.title as course_title, u.name as teacher_name
         FROM sections s
         JOIN courses c ON s.course_id = c.id
         LEFT JOIN users u ON s.teacher_id = u.id
         WHERE s.id = ?`,
        [id]
      );

      return res.json({
        success: true,
        message: 'Section updated successfully',
        data: updated[0]
      });

    } catch (error) {
      console.error('Update section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update section'
      });
    }
  }

  /**
   * Delete a section
   * DELETE /api/admin/sections/:id
   */
  static async deleteSection(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const pool = getPool();

      // Check if section has enrollments
      const [enrollments] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM enrollments WHERE section_id = ?',
        [id]
      );

      if (enrollments[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete section with ${enrollments[0].count} enrolled students. Remove enrollments first.`
        });
      }

      // Delete section
      const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM sections WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }

      return res.json({
        success: true,
        message: 'Section deleted successfully'
      });

    } catch (error) {
      console.error('Delete section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete section'
      });
    }
  }

  /**
   * Assign teacher to section
   * POST /api/admin/sections/:id/assign-teacher
   */
  static async assignTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { teacher_id } = req.body;

      const pool = getPool();

      // Verify teacher exists
      const [teachers] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name FROM users WHERE id = ? AND role = "teacher"',
        [teacher_id]
      );

      if (teachers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      // Update section
      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE sections SET teacher_id = ? WHERE id = ?',
        [teacher_id, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }

      return res.json({
        success: true,
        message: `Teacher ${teachers[0].name} assigned to section successfully`
      });

    } catch (error) {
      console.error('Assign teacher to section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign teacher'
      });
    }
  }

  /**
   * Remove teacher from section
   * DELETE /api/admin/sections/:id/teacher
   */
  static async removeTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const pool = getPool();

      const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE sections SET teacher_id = NULL WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }

      return res.json({
        success: true,
        message: 'Teacher removed from section successfully'
      });

    } catch (error) {
      console.error('Remove teacher from section error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove teacher'
      });
    }
  }
}
