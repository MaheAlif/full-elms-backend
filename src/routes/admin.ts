import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  validateAdminCreateCourse,
  validateAdminUpdateCourse,
  validateCreateTeacher,
  validateCreateStudent,
  validateAssignTeacher,
  validateEnrollStudent,
  validateIdParam,
  validatePagination,
  validateCreateUniversityEvent,
  validateBroadcastNotification
} from '../middleware/validation';

const router = Router();

// Apply authentication and admin role check to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// ===== COURSE MANAGEMENT ROUTES =====
router.get('/courses', validatePagination, AdminController.getCourses);
router.post('/courses', validateAdminCreateCourse, AdminController.createCourse);
router.put('/courses/:id', validateIdParam, validateAdminUpdateCourse, AdminController.updateCourse);
router.delete('/courses/:id', validateIdParam, AdminController.deleteCourse);

// ===== USER MANAGEMENT ROUTES =====
router.get('/users', AdminController.getUsers);
router.get('/teachers', AdminController.getTeachers);
router.post('/teachers', validateCreateTeacher, AdminController.createTeacher);
router.post('/students', validateCreateStudent, AdminController.createStudent);

// ===== TEACHER-COURSE ASSIGNMENT ROUTES =====
router.post('/assign-teacher', validateAssignTeacher, AdminController.assignTeacher);
router.delete('/assign-teacher', validateAssignTeacher, AdminController.removeTeacherAssignment);

// ===== ENROLLMENT MANAGEMENT ROUTES =====
router.get('/enrollments/:courseId', validateIdParam, AdminController.getCourseEnrollments);
router.post('/enrollments', validateEnrollStudent, AdminController.enrollStudent);
router.delete('/enrollments/:enrollmentId', validateIdParam, AdminController.removeEnrollment);

// ===== DETAILED VIEW ROUTES =====
router.get('/teachers/:id/profile', validateIdParam, AdminController.getTeacherProfile);
router.get('/students/:id/profile', validateIdParam, AdminController.getStudentProfile);
router.get('/courses/:id/details', validateIdParam, AdminController.getCourseDetails);

// ===== SYSTEM STATISTICS ROUTES =====
router.get('/stats', AdminController.getSystemStats);

// ===== CALENDAR & NOTIFICATION MANAGEMENT ROUTES =====
router.get('/calendar', AdminController.getCalendar);
router.post('/calendar/university-events', validateCreateUniversityEvent, AdminController.createUniversityEvent);
router.put('/calendar/university-events/:id', validateIdParam, validateCreateUniversityEvent, AdminController.updateUniversityEvent);
router.delete('/calendar/university-events/:id', validateIdParam, AdminController.deleteUniversityEvent);
router.get('/notifications', AdminController.getNotifications);
router.post('/notifications/broadcast', validateBroadcastNotification, AdminController.broadcastNotification);

export default router;