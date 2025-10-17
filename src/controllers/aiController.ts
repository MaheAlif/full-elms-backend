/**
 * AI Controller
 * Handles AI Learning Assistant interactions for students
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { getPool } from '../utils/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as aiService from '../services/aiService';

export class AIController {
  
  /**
   * Send message to AI and get response
   * POST /api/student/ai/chat
   */
  static async chat(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { message, course_id } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      const connection = getPool();

      // Get user info
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT name FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userName = users[0].name;
      let courseName: string | undefined;

      // Get course name if provided
      if (course_id) {
        const [courses] = await connection.execute<RowDataPacket[]>(
          'SELECT title FROM courses WHERE id = ?',
          [course_id]
        );
        if (courses.length > 0) {
          courseName = courses[0].title;
        }
      }

      // Get user's AI context (last 10 interactions)
      const [historyRows] = await connection.execute<RowDataPacket[]>(
        `SELECT role, query as message FROM (
          SELECT 'user' as role, query, created_at FROM ai_interactions WHERE user_id = ?
          UNION ALL
          SELECT 'assistant' as role, response, created_at FROM ai_interactions WHERE user_id = ?
        ) as conversation
        ORDER BY created_at DESC
        LIMIT 20`,
        [userId, userId]
      );

      const history = (historyRows as any[]).reverse();

      // Build conversation context
      const systemPrompt = aiService.buildSystemPrompt(userName, courseName);
      const conversationHistory = aiService.formatConversationHistory(history, 10);

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory,
        { role: 'user' as const, content: message },
      ];

      // Get AI response
      const aiResponse = await aiService.chatCompletion(messages);

      // Save interaction to database
      await connection.execute(
        'INSERT INTO ai_interactions (user_id, query, response) VALUES (?, ?, ?)',
        [userId, message, aiResponse]
      );

      // Update user context (store last conversation state)
      const contextData = {
        lastQuery: message,
        lastResponse: aiResponse,
        courseName: courseName || null,
        timestamp: new Date().toISOString(),
      };

      await connection.execute(
        `INSERT INTO ai_user_context (user_id, context_json, updated_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE context_json = ?, updated_at = NOW()`,
        [userId, JSON.stringify(contextData), JSON.stringify(contextData)]
      );

      return res.json({
        success: true,
        data: {
          message: aiResponse,
          timestamp: new Date().toISOString(),
        }
      });

    } catch (error) {
      console.error('AI chat error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get AI chat history
   * GET /api/student/ai/history
   */
  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 50;
      const connection = getPool();

      const [interactions] = await connection.execute<RowDataPacket[]>(
        `SELECT 
          id,
          query,
          response,
          created_at
        FROM ai_interactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?`,
        [userId, limit]
      );

      // Format into conversation format
      const conversation = (interactions as any[]).reverse().flatMap(interaction => [
        {
          id: `${interaction.id}-user`,
          role: 'user',
          message: interaction.query,
          timestamp: interaction.created_at,
        },
        {
          id: `${interaction.id}-ai`,
          role: 'assistant',
          message: interaction.response,
          timestamp: interaction.created_at,
        },
      ]);

      return res.json({
        success: true,
        data: { conversation }
      });

    } catch (error) {
      console.error('Get AI history error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve chat history'
      });
    }
  }

  /**
   * Add study material to AI context
   * POST /api/student/ai/add-material/:materialId
   */
  static async addMaterialToContext(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const materialId = req.params.materialId;
      const connection = getPool();

      // Verify student has access to this material
      const [materials] = await connection.execute<RowDataPacket[]>(
        `SELECT 
          m.id,
          m.title,
          m.type,
          m.file_path,
          c.title as course_name
        FROM materials m
        JOIN sections s ON m.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        JOIN enrollments e ON (e.section_id = s.id OR e.course_id = c.id)
        WHERE m.id = ? AND e.user_id = ?`,
        [materialId, userId]
      );

      if (materials.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Material not found or not enrolled'
        });
      }

      const material = materials[0];

      // Generate AI summary/context about the material
      const aiContext = await aiService.generateMaterialSummary(
        material.title,
        material.type,
        material.course_name
      );

      // Save to AI interactions as context
      await connection.execute(
        'INSERT INTO ai_interactions (user_id, query, response) VALUES (?, ?, ?)',
        [
          userId,
          `[MATERIAL ADDED] ${material.title} (${material.type}) from ${material.course_name}`,
          aiContext
        ]
      );

      // Update user context
      const contextData = {
        addedMaterial: {
          id: material.id,
          title: material.title,
          type: material.type,
          course: material.course_name,
        },
        timestamp: new Date().toISOString(),
      };

      await connection.execute(
        `INSERT INTO ai_user_context (user_id, context_json, updated_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
         context_json = JSON_MERGE_PATCH(context_json, ?),
         updated_at = NOW()`,
        [userId, JSON.stringify(contextData), JSON.stringify(contextData)]
      );

      return res.json({
        success: true,
        message: 'Material added to AI context',
        data: {
          materialTitle: material.title,
          aiContext,
        }
      });

    } catch (error) {
      console.error('Add material to AI context error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add material to AI context'
      });
    }
  }

  /**
   * Clear AI conversation history
   * DELETE /api/student/ai/clear
   */
  static async clearHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const connection = getPool();

      await connection.execute(
        'DELETE FROM ai_interactions WHERE user_id = ?',
        [userId]
      );

      await connection.execute(
        'DELETE FROM ai_user_context WHERE user_id = ?',
        [userId]
      );

      return res.json({
        success: true,
        message: 'AI conversation history cleared'
      });

    } catch (error) {
      console.error('Clear AI history error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to clear history'
      });
    }
  }

  /**
   * Get AI context summary
   * GET /api/student/ai/context
   */
  static async getContext(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const connection = getPool();

      const [contexts] = await connection.execute<RowDataPacket[]>(
        'SELECT context_json, updated_at FROM ai_user_context WHERE user_id = ?',
        [userId]
      );

      if (contexts.length === 0) {
        return res.json({
          success: true,
          data: { context: null }
        });
      }

      const context = JSON.parse(contexts[0].context_json);

      return res.json({
        success: true,
        data: {
          context,
          updatedAt: contexts[0].updated_at,
        }
      });

    } catch (error) {
      console.error('Get AI context error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve AI context'
      });
    }
  }
}