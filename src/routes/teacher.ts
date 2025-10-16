import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';
import { authenticateToken, requireTeacher } from '../middleware/auth';
import { uploadMaterial } from '../middleware/upload';
import {
  validateCreateSection,
  validateCreateAssignment,
  validateUpdateAssignment,
  validateGradeSubmission,
  validateIdParam,
  validatePagination,
  validateCreateCalendarEvent,
  validateCreateAnnouncement
} from '../middleware/validation';

const router = Router();

// Apply authentication and teacher role check to all teacher routes
router.use(authenticateToken);
router.use(requireTeacher);

// ===== COURSE MANAGEMENT ROUTES =====
router.get('/courses', TeacherController.getCourses);
router.get('/courses/:id/details', validateIdParam, TeacherController.getCourseDetails);

// ===== STUDENT MANAGEMENT ROUTES =====
router.get('/students', TeacherController.getStudents);

// ===== SECTION MANAGEMENT ROUTES =====
// Teachers can only VIEW their assigned sections (admin creates sections)
router.get('/sections', TeacherController.getSections);

// ===== MATERIAL MANAGEMENT ROUTES =====
router.get('/materials', TeacherController.getMaterials);
router.post('/materials/upload', uploadMaterial, TeacherController.uploadMaterial);
router.delete('/materials/:id', validateIdParam, TeacherController.deleteMaterial);

// ===== ASSIGNMENT MANAGEMENT ROUTES =====
router.get('/assignments', TeacherController.getAssignments);
router.post('/assignments', validateCreateAssignment, TeacherController.createAssignment);
router.put('/assignments/:id', validateIdParam, validateUpdateAssignment, TeacherController.updateAssignment);
router.delete('/assignments/:id', validateIdParam, TeacherController.deleteAssignment);

// ===== GRADING ROUTES =====
router.get('/assignments/:id/submissions', validateIdParam, TeacherController.getAssignmentSubmissions);
router.get('/submissions/:id/download', validateIdParam, TeacherController.downloadSubmission);
router.put('/submissions/:id/grade', validateIdParam, validateGradeSubmission, TeacherController.gradeSubmission);

// ===== CALENDAR & ANNOUNCEMENT ROUTES =====
router.get('/calendar', TeacherController.getCalendar);
router.post('/calendar/events', validateCreateCalendarEvent, TeacherController.createCalendarEvent);
router.put('/calendar/events/:id', validateIdParam, validateCreateCalendarEvent, TeacherController.updateCalendarEvent);
router.delete('/calendar/events/:id', validateIdParam, TeacherController.deleteCalendarEvent);
router.post('/announcements', validateCreateAnnouncement, TeacherController.createAnnouncement);

// ===== NOTIFICATION ROUTES =====
router.get('/notifications', TeacherController.getNotifications);
router.put('/notifications/:id/read', validateIdParam, TeacherController.markNotificationRead);

export default router;