import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticateToken, requireStudent } from '../middleware/auth';
import { uploadSubmission } from '../middleware/upload';
import {
  validateIdParam,
  validateSubmissionUpload
} from '../middleware/validation';

const router = Router();

// Apply authentication and student role check to all student routes
router.use(authenticateToken);
router.use(requireStudent);

// ===== COURSE MANAGEMENT ROUTES =====
router.get('/courses', StudentController.getCourses);
router.get('/courses/:id/details', validateIdParam, StudentController.getCourseDetails);

// ===== MATERIAL ACCESS ROUTES =====
router.get('/materials', StudentController.getMaterials);
router.get('/materials/:id/download', validateIdParam, StudentController.downloadMaterial);

// ===== ASSIGNMENT ROUTES =====
router.get('/assignments', StudentController.getAssignments);
router.get('/assignments/:id', validateIdParam, StudentController.getAssignmentDetails);
router.post('/assignments/:id/submit', validateIdParam, uploadSubmission, validateSubmissionUpload, StudentController.submitAssignment);

// ===== CALENDAR ROUTES =====
router.get('/calendar', StudentController.getCalendar);

// ===== PROFILE ROUTES =====
router.get('/profile', StudentController.getProfile);

// ===== NOTIFICATION ROUTES =====
router.get('/notifications', StudentController.getNotifications);
router.put('/notifications/:id/read', validateIdParam, StudentController.markNotificationRead);
router.put('/notifications/mark-all-read', StudentController.markAllNotificationsRead);

// ===== CHAT ROUTES (Placeholder for future implementation) =====
router.get('/chat', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student chat endpoint - Implementation coming in Phase 6'
  });
});

router.post('/chat/send', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Student chat send endpoint - Implementation coming in Phase 6'
  });
});

export default router;