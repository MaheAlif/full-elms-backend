# API Guide for ELMS Backend

This guide outlines the backend API endpoints required to connect the ELMS backend to the frontend. Each endpoint should follow RESTful conventions and return JSON responses.

## 1. Authentication & User Management
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/users/me` — Get current user profile
- `PUT /api/users/me` — Update current user profile
- `GET /api/users/:id` — Get user by ID (admin/teacher)
- `GET /api/users` — List all users (admin)

## 2. Courses & Sections
- `GET /api/courses` — List all courses
- `POST /api/courses` — Create a new course (teacher/admin)
- `GET /api/courses/:id` — Get course details
- `PUT /api/courses/:id` — Update course (teacher/admin)
- `DELETE /api/courses/:id` — Delete course (admin)
- `GET /api/courses/:id/sections` — List sections for a course
- `POST /api/sections` — Create a section (teacher/admin)
- `GET /api/sections/:id` — Get section details
- `PUT /api/sections/:id` — Update section
- `DELETE /api/sections/:id` — Delete section

## 3. Enrollment
- `POST /api/enrollments` — Enroll a user in a section
- `GET /api/enrollments?user_id=...` — List enrollments for a user
- `DELETE /api/enrollments/:id` — Remove enrollment

## 4. Announcements & Notifications
- `GET /api/announcements?section_id=...` — List announcements for a section
- `POST /api/announcements` — Create announcement (teacher)
- `GET /api/notifications` — List notifications for current user
- `PUT /api/notifications/:id/read` — Mark notification as read

## 5. Assignments & Submissions
- `GET /api/assignments?section_id=...` — List assignments for a section
- `POST /api/assignments` — Create assignment (teacher)
- `GET /api/assignments/:id` — Get assignment details
- `PUT /api/assignments/:id` — Update assignment
- `DELETE /api/assignments/:id` — Delete assignment
- `POST /api/submissions` — Submit assignment (student)
- `GET /api/submissions?assignment_id=...` — List submissions for an assignment (teacher)
- `GET /api/submissions?student_id=...` — List submissions for a student
- `PUT /api/submissions/:id/grade` — Grade a submission (teacher)

## 6. Materials
- `GET /api/materials?section_id=...` — List materials for a section
- `POST /api/materials` — Upload material (teacher)
- `DELETE /api/materials/:id` — Delete material

## 7. Calendar Events
- `GET /api/calendar?section_id=...` — List calendar events for a section
- `POST /api/calendar` — Create event (teacher)
- `DELETE /api/calendar/:id` — Delete event

## 8. Chat & AI
- `GET /api/chat/rooms?section_id=...` — List chat rooms for a section
- `POST /api/chat/rooms` — Create chat room
- `GET /api/chat/messages?room_id=...` — List messages in a room
- `POST /api/chat/messages` — Send message
- `POST /api/ai/query` — Send query to AI assistant
- `GET /api/ai/context` — Get AI user context

---

## Integration Notes
- All endpoints should require authentication unless public.
- Use JWT or session-based authentication.
- File uploads (materials, submissions) should use multipart/form-data.
- Return appropriate HTTP status codes and error messages.

---

This guide covers the essential endpoints for a full-featured ELMS backend. Adjust or expand as needed for your frontend requirements.
