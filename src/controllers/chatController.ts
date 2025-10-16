import { Response } from 'express';
import { getPool } from '../utils/database';
import { AuthenticatedRequest } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * Chat Controller
 * Handles course-specific chat operations
 */
export class ChatController {
  
  /**
   * Get or create chat room for a course section and retrieve chat history
   * GET /api/student/courses/:courseId/chat
   */
  static async getCourseChat(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { courseId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const pool = getPool();

      // First, verify the student is enrolled in this course
      const [enrollmentCheck] = await pool.execute<RowDataPacket[]>(
        `SELECT e.id, e.section_id, s.name as section_name, 
                c.id as course_id, c.title as course_name, c.course_code
         FROM enrollments e
         JOIN sections s ON e.section_id = s.id
         JOIN courses c ON s.course_id = c.id
         WHERE e.user_id = ? AND c.id = ?
         LIMIT 1`,
        [userId, courseId]
      );

      if (enrollmentCheck.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course'
        });
      }

      const enrollment = enrollmentCheck[0];
      const sectionId = enrollment.section_id;

      // Get or create chat room for this section
      let [chatRooms] = await pool.execute<RowDataPacket[]>(
        `SELECT id, name FROM chat_rooms WHERE section_id = ?`,
        [sectionId]
      );

      let roomId: number;

      if (chatRooms.length === 0) {
        // Create new chat room for this section
        const roomName = `${enrollment.section_name} Chat`;
        const [result] = await pool.execute<ResultSetHeader>(
          `INSERT INTO chat_rooms (section_id, name) VALUES (?, ?)`,
          [sectionId, roomName]
        );
        roomId = result.insertId;
        console.log(`✅ Created new chat room: ${roomName} (ID: ${roomId})`);
      } else {
        roomId = chatRooms[0].id;
      }

      // Get chat history (last 100 messages)
      const [messages] = await pool.execute<RowDataPacket[]>(
        `SELECT cm.id, cm.message, cm.message_type, cm.file_url, cm.timestamp,
                cm.sender_id, u.name as sender_name, u.avatar_url as sender_avatar
         FROM chat_messages cm
         JOIN users u ON cm.sender_id = u.id
         WHERE cm.room_id = ?
         ORDER BY cm.timestamp ASC
         LIMIT 100`,
        [roomId]
      );

      // Get participants (students enrolled in this section)
      const [participants] = await pool.execute<RowDataPacket[]>(
        `SELECT DISTINCT u.id, u.name, u.email, u.avatar_url, u.role
         FROM enrollments e
         JOIN users u ON e.user_id = u.id
         WHERE e.section_id = ?
         ORDER BY u.name`,
        [sectionId]
      );

      // Also include the teacher
      const [teacher] = await pool.execute<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, u.avatar_url, u.role
         FROM courses c
         JOIN users u ON c.teacher_id = u.id
         WHERE c.id = ?`,
        [courseId]
      );

      const allParticipants = [...participants, ...teacher];

      return res.status(200).json({
        success: true,
        data: {
          room: {
            id: roomId,
            name: chatRooms.length > 0 ? chatRooms[0].name : `${enrollment.section_name} Chat`,
            section_id: sectionId,
            section_name: enrollment.section_name,
            course_name: enrollment.course_name,
            course_code: enrollment.course_code
          },
          messages: messages.map(msg => ({
            id: msg.id,
            sender_id: msg.sender_id,
            sender_name: msg.sender_name,
            sender_avatar: msg.sender_avatar,
            message: msg.message,
            message_type: msg.message_type,
            file_url: msg.file_url,
            timestamp: msg.timestamp,
            isCurrentUser: msg.sender_id === userId
          })),
          participants: allParticipants.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            avatar_url: p.avatar_url,
            role: p.role,
            isCurrentUser: p.id === userId
          })),
          currentUserId: userId
        }
      });

    } catch (error) {
      console.error('Get course chat error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve course chat'
      });
    }
  }

  /**
   * Send a message to a course chat
   * POST /api/student/courses/:courseId/chat
   */
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { courseId } = req.params;
      const { message, message_type = 'text', file_url = null } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message content is required'
        });
      }

      // Validate message length
      if (message.length > 2000) {
        return res.status(400).json({
          success: false,
          message: 'Message is too long (max 2000 characters)'
        });
      }

      const pool = getPool();

      // Verify enrollment and get room ID
      const [enrollmentCheck] = await pool.execute<RowDataPacket[]>(
        `SELECT e.section_id, cr.id as room_id
         FROM enrollments e
         JOIN sections s ON e.section_id = s.id
         JOIN courses c ON s.course_id = c.id
         LEFT JOIN chat_rooms cr ON cr.section_id = s.id
         WHERE e.user_id = ? AND c.id = ?
         LIMIT 1`,
        [userId, courseId]
      );

      if (enrollmentCheck.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course'
        });
      }

      let roomId = enrollmentCheck[0].room_id;

      // If room doesn't exist, create it
      if (!roomId) {
        const sectionId = enrollmentCheck[0].section_id;
        const [result] = await pool.execute<ResultSetHeader>(
          `INSERT INTO chat_rooms (section_id, name) 
           VALUES (?, (SELECT CONCAT(s.name, ' Chat') FROM sections s WHERE s.id = ?))`,
          [sectionId, sectionId]
        );
        roomId = result.insertId;
      }

      // Insert message into database
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO chat_messages (room_id, sender_id, message, message_type, file_url)
         VALUES (?, ?, ?, ?, ?)`,
        [roomId, userId, message, message_type, file_url]
      );

      // Get the inserted message with user details
      const [newMessage] = await pool.execute<RowDataPacket[]>(
        `SELECT cm.id, cm.message, cm.message_type, cm.file_url, cm.timestamp,
                cm.sender_id, u.name as sender_name, u.avatar_url as sender_avatar
         FROM chat_messages cm
         JOIN users u ON cm.sender_id = u.id
         WHERE cm.id = ?`,
        [result.insertId]
      );

      console.log(`💬 Message sent by user ${userId} in room ${roomId}`);

      return res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: {
          id: newMessage[0].id,
          room_id: roomId,
          sender_id: newMessage[0].sender_id,
          sender_name: newMessage[0].sender_name,
          sender_avatar: newMessage[0].sender_avatar,
          message: newMessage[0].message,
          message_type: newMessage[0].message_type,
          file_url: newMessage[0].file_url,
          timestamp: newMessage[0].timestamp,
          isCurrentUser: true
        }
      });

    } catch (error) {
      console.error('Send message error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  /**
   * Get chat participants for a course
   * GET /api/student/courses/:courseId/chat/participants
   */
  static async getChatParticipants(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { courseId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const pool = getPool();

      // Verify enrollment
      const [enrollmentCheck] = await pool.execute<RowDataPacket[]>(
        `SELECT e.section_id FROM enrollments e
         JOIN sections s ON e.section_id = s.id
         JOIN courses c ON s.course_id = c.id
         WHERE e.user_id = ? AND c.id = ?`,
        [userId, courseId]
      );

      if (enrollmentCheck.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not enrolled in this course'
        });
      }

      const sectionId = enrollmentCheck[0].section_id;

      // Get all students in the section
      const [students] = await pool.execute<RowDataPacket[]>(
        `SELECT DISTINCT u.id, u.name, u.email, u.avatar_url, u.role
         FROM enrollments e
         JOIN users u ON e.user_id = u.id
         WHERE e.section_id = ?
         ORDER BY u.name`,
        [sectionId]
      );

      // Get the teacher
      const [teacher] = await pool.execute<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, u.avatar_url, u.role
         FROM courses c
         JOIN sections s ON c.id = s.course_id
         JOIN users u ON c.teacher_id = u.id
         WHERE s.id = ?`,
        [sectionId]
      );

      const participants = [...students, ...teacher];

      return res.status(200).json({
        success: true,
        data: {
          total: participants.length,
          participants: participants.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            avatar_url: p.avatar_url,
            role: p.role,
            isCurrentUser: p.id === userId
          }))
        }
      });

    } catch (error) {
      console.error('Get chat participants error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve chat participants'
      });
    }
  }

  /**
   * Delete a chat message (only sender can delete)
   * DELETE /api/student/courses/:courseId/chat/:messageId
   */
  static async deleteMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { messageId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const pool = getPool();

      // Check if user owns the message
      const [messageCheck] = await pool.execute<RowDataPacket[]>(
        `SELECT id, sender_id FROM chat_messages WHERE id = ?`,
        [messageId]
      );

      if (messageCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      if (messageCheck[0].sender_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own messages'
        });
      }

      // Delete the message
      await pool.execute(
        `DELETE FROM chat_messages WHERE id = ?`,
        [messageId]
      );

      console.log(`🗑️ Message ${messageId} deleted by user ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });

    } catch (error) {
      console.error('Delete message error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete message'
      });
    }
  }
}
