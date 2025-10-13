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
  validatePagination
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
router.get('/sections', TeacherController.getSections);
router.post('/sections', validateCreateSection, TeacherController.createSection);

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
router.put('/submissions/:id/grade', validateIdParam, validateGradeSubmission, TeacherController.gradeSubmission);

export default router;