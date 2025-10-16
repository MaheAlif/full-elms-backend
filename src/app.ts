import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { handleUploadError } from './middleware/upload';

// Import routes
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import teacherRoutes from './routes/teacher';
import adminRoutes from './routes/admin';

// Import database connection
import { connectDatabase, getPool } from './utils/database';
import { RowDataPacket } from 'mysql2';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Create Socket.IO instance
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware setup
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001", // Allow alternate port
    "http://localhost:3002"  // Allow new frontend port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ELMS Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files (uploads) - Single declaration
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    // Set proper headers for file downloads
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  // Store user info on socket
  let currentUserId: number | null = null;
  let currentUserName: string | null = null;

  // Authenticate socket connection
  socket.on('authenticate', async (data: { userId: number; userName: string }) => {
    currentUserId = data.userId;
    currentUserName = data.userName;
    console.log(`✅ Socket authenticated: ${currentUserName} (ID: ${currentUserId})`);
  });

  // Join chat room (course-specific)
  socket.on('join-room', async (data: { roomId: number; courseId: number; userId: number }) => {
    const { roomId, courseId, userId } = data;
    
    try {
      const pool = getPool();
      
      // Verify user is enrolled in this course
      const [enrollment] = await pool.execute<RowDataPacket[]>(
        `SELECT e.id FROM enrollments e
         JOIN sections s ON e.section_id = s.id
         JOIN courses c ON s.course_id = c.id
         JOIN chat_rooms cr ON cr.section_id = s.id
         WHERE e.user_id = ? AND c.id = ? AND cr.id = ?`,
        [userId, courseId, roomId]
      );

      if (enrollment.length === 0) {
        socket.emit('error', { message: 'Unauthorized: Not enrolled in this course' });
        return;
      }

      socket.join(`room-${roomId}`);
      console.log(`👤 User ${userId} joined room-${roomId} (course: ${courseId})`);
      
      // Notify others in the room
      socket.to(`room-${roomId}`).emit('user-joined', {
        userId,
        userName: currentUserName,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave chat room
  socket.on('leave-room', (data: { roomId: number }) => {
    const { roomId } = data;
    socket.leave(`room-${roomId}`);
    console.log(`👋 User ${currentUserId} left room-${roomId}`);
    
    // Notify others
    socket.to(`room-${roomId}`).emit('user-left', {
      userId: currentUserId,
      userName: currentUserName,
      timestamp: new Date().toISOString()
    });
  });

  // Handle chat messages with database persistence
  socket.on('chat-message', async (data: { 
    roomId: number; 
    message: string; 
    senderId: number;
    senderName: string;
    messageType?: string;
    fileUrl?: string;
  }) => {
    const { roomId, message, senderId, senderName, messageType = 'text', fileUrl = null } = data;
    
    try {
      const pool = getPool();
      
      // Save message to database
      const [result] = await pool.execute<RowDataPacket[]>(
        `INSERT INTO chat_messages (room_id, sender_id, message, message_type, file_url)
         VALUES (?, ?, ?, ?, ?)`,
        [roomId, senderId, message, messageType, fileUrl]
      );

      const messageId = (result as any).insertId;

      // Get sender avatar
      const [user] = await pool.execute<RowDataPacket[]>(
        `SELECT avatar_url FROM users WHERE id = ?`,
        [senderId]
      );

      const messageData = {
        id: messageId,
        room_id: roomId,
        sender_id: senderId,
        sender_name: senderName,
        sender_avatar: user[0]?.avatar_url || null,
        message,
        message_type: messageType,
        file_url: fileUrl,
        timestamp: new Date().toISOString()
      };

      // Broadcast to all users in the room (including sender)
      io.to(`room-${roomId}`).emit('chat-message', messageData);
      
      console.log(`💬 Message saved and broadcast in room-${roomId} by user ${senderId}`);
    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle message deletion
  socket.on('delete-message', async (data: { messageId: number; roomId: number; userId: number }) => {
    const { messageId, roomId, userId } = data;
    
    try {
      const pool = getPool();
      
      // Verify ownership
      const [message] = await pool.execute<RowDataPacket[]>(
        `SELECT sender_id FROM chat_messages WHERE id = ?`,
        [messageId]
      );

      if (message.length === 0 || message[0].sender_id !== userId) {
        socket.emit('error', { message: 'Cannot delete this message' });
        return;
      }

      // Delete from database
      await pool.execute(
        `DELETE FROM chat_messages WHERE id = ?`,
        [messageId]
      );

      // Broadcast deletion to all users in room
      io.to(`room-${roomId}`).emit('message-deleted', { messageId, roomId });
      
      console.log(`🗑️ Message ${messageId} deleted in room-${roomId}`);
    } catch (error) {
      console.error('Delete message error:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data: { roomId: number; userId: number; userName: string }) => {
    socket.to(`room-${data.roomId}`).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
      roomId: data.roomId
    });
  });

  socket.on('typing-stop', (data: { roomId: number; userId: number }) => {
    socket.to(`room-${data.roomId}`).emit('user-stopped-typing', {
      userId: data.userId,
      roomId: data.roomId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id, currentUserName || 'Unknown');
  });
});

// Upload error handler
app.use(handleUploadError);

// 404 handler - must come after all routes but before global error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 ELMS Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔄 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err.message);
  httpServer.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
export { io }; // Export Socket.IO instance for use in other modules
