import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  validateAdminCreateCourse,
  validateAdminUpdateCourse,
  validateAssignTeacher,
  validateEnrollStudent,
  validateIdParam,
  validatePagination
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

// ===== TEACHER-COURSE ASSIGNMENT ROUTES =====
router.post('/assign-teacher', validateAssignTeacher, AdminController.assignTeacher);
router.delete('/assign-teacher', validateAssignTeacher, AdminController.removeTeacherAssignment);

// ===== ENROLLMENT MANAGEMENT ROUTES =====
router.get('/enrollments/:courseId', validateIdParam, AdminController.getCourseEnrollments);
router.post('/enrollments', validateEnrollStudent, AdminController.enrollStudent);
router.delete('/enrollments/:enrollmentId', validateIdParam, AdminController.removeEnrollment);

// ===== SYSTEM STATISTICS ROUTES =====
router.get('/stats', AdminController.getSystemStats);

export default router;