import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware factory
 * Creates middleware that validates request body, params, or query
 */
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[source]);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({
        success: false,
        error: `Validation error: ${errorMessage}`
      });
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User validation schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'teacher', 'admin').required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    avatar_url: Joi.string().uri()
  }),

  // Course validation schemas
  createCourse: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000),
    teacher_id: Joi.number().integer().positive().required(),
    color: Joi.string().max(50)
  }),

  updateCourse: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(1000),
    teacher_id: Joi.number().integer().positive(),
    color: Joi.string().max(50)
  }),

  // Admin course validation schemas
  adminCreateCourse: Joi.object({
    course_name: Joi.string().min(3).max(200).required(),
    course_code: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(1000).allow(''),
    credits: Joi.number().integer().min(1).max(10).required(),
    semester: Joi.string().valid('Fall', 'Spring', 'Summer').required(),
    academic_year: Joi.string().pattern(/^\d{4}-\d{4}$/).required()
  }),

  adminUpdateCourse: Joi.object({
    course_name: Joi.string().min(3).max(200),
    course_code: Joi.string().min(2).max(20),
    description: Joi.string().max(1000).allow(''),
    credits: Joi.number().integer().min(1).max(10),
    semester: Joi.string().valid('Fall', 'Spring', 'Summer'),
    academic_year: Joi.string().pattern(/^\d{4}-\d{4}$/)
  }),

  // User creation schemas
  createTeacher: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  createStudent: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // Admin user management validation
  assignTeacher: Joi.object({
    teacher_id: Joi.number().integer().positive().required(),
    course_id: Joi.number().integer().positive().required()
  }),

  enrollStudent: Joi.object({
    student_id: Joi.number().integer().positive().required(),
    section_id: Joi.number().integer().positive().required()
  }),

  // Section validation schemas
  createSection: Joi.object({
    course_id: Joi.number().integer().positive().required(),
    name: Joi.string().min(3).max(100).required(),
    teacher_id: Joi.number().integer().positive().optional(),
    max_capacity: Joi.number().integer().min(1).max(200).optional()
  }),

  updateSection: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    teacher_id: Joi.number().integer().positive().allow(null).optional(),
    max_capacity: Joi.number().integer().min(1).max(200).optional()
  }),

  assignTeacherToSection: Joi.object({
    teacher_id: Joi.number().integer().positive().required()
  }),

  // Assignment validation schemas
  createAssignment: Joi.object({
    section_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(2000),
    due_date: Joi.date().greater('now'),
    total_marks: Joi.number().integer().positive()
  }),

  updateAssignment: Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(2000),
    due_date: Joi.date().greater('now'),
    total_marks: Joi.number().integer().positive()
  }),

  // Submission validation schemas
  submitAssignment: Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(1000)
  }),

  // Material validation schemas
  createMaterial: Joi.object({
    section_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required(),
    type: Joi.string().valid('pdf', 'doc', 'ppt', 'video', 'other').required(),
    url: Joi.string().uri() // For external links
  }),

  // Chat message validation
  sendMessage: Joi.object({
    room_id: Joi.number().integer().positive().required(),
    message: Joi.string().min(1).max(1000).required()
  }),

  // Enrollment validation
  createEnrollment: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    section_id: Joi.number().integer().positive().required()
  }),

  // Calendar event validation
  createCalendarEvent: Joi.object({
    section_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).allow('').optional(),
    date: Joi.date().required(),
    type: Joi.string().valid('assignment', 'exam', 'meeting', 'class').required()
  }),

  // Announcement validation
  createAnnouncement: Joi.object({
    section_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required(),
    content: Joi.string().min(10).max(2000).required()
  }),

  // University event validation
  createUniversityEvent: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).allow('').optional(),
    date: Joi.date().required(),
    type: Joi.string().valid('holiday', 'exam_week', 'registration', 'orientation', 'graduation', 'maintenance', 'event').required(),
    priority: Joi.string().valid('low', 'normal', 'high').default('normal')
  }),

  // Broadcast notification validation
  broadcastNotification: Joi.object({
    message: Joi.string().min(10).max(500).required(),
    type: Joi.string().valid('assignment', 'due_event', 'reminder', 'grade_posted').required(),
    target_roles: Joi.array().items(Joi.string().valid('student', 'teacher', 'admin')).min(1).required()
  }),

  // Submission grading validation
  gradeSubmission: Joi.object({
    grade: Joi.number().min(0).max(1000).required(),
    feedback: Joi.string().max(2000).allow('').optional()
  }),

  // AI interaction validation
  aiQuery: Joi.object({
    query: Joi.string().min(1).max(1000).required(),
    context: Joi.object().optional()
  }),

  // Notification validation
  createNotification: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    type: Joi.string().valid('assignment', 'due_event', 'reminder', 'grade_posted').required(),
    message: Joi.string().min(1).max(500).required()
  }),

  // ID parameter validation
  idParam: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  // Pagination query validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().max(100)
  })
};

// Commonly used validation middleware
export const validateLogin = validate(schemas.login);
export const validateUpdateProfile = validate(schemas.updateProfile);
export const validateCreateCourse = validate(schemas.createCourse);
export const validateUpdateCourse = validate(schemas.updateCourse);
export const validateCreateSection = validate(schemas.createSection);
export const validateCreateAssignment = validate(schemas.createAssignment);
export const validateUpdateAssignment = validate(schemas.updateAssignment);
export const validateCreateMaterial = validate(schemas.createMaterial);
export const validateSendMessage = validate(schemas.sendMessage);
export const validateCreateEnrollment = validate(schemas.createEnrollment);
export const validateCreateCalendarEvent = validate(schemas.createCalendarEvent);
export const validateCreateAnnouncement = validate(schemas.createAnnouncement);
export const validateCreateUniversityEvent = validate(schemas.createUniversityEvent);
export const validateBroadcastNotification = validate(schemas.broadcastNotification);
export const validateGradeSubmission = validate(schemas.gradeSubmission);
export const validateSubmissionUpload = validate(schemas.submitAssignment);
export const validateAiQuery = validate(schemas.aiQuery);
export const validateCreateNotification = validate(schemas.createNotification);
export const validateIdParam = validate(schemas.idParam, 'params');
export const validatePagination = validate(schemas.pagination, 'query');

// Admin validation middleware
export const validateAdminCreateCourse = validate(schemas.adminCreateCourse);
export const validateAdminUpdateCourse = validate(schemas.adminUpdateCourse);
export const validateCreateTeacher = validate(schemas.createTeacher);
export const validateCreateStudent = validate(schemas.createStudent);
export const validateAssignTeacher = validate(schemas.assignTeacher);
export const validateEnrollStudent = validate(schemas.enrollStudent);