# ELMS Frontend to Backend Integration Guide

## 🏗️ Project Architecture Overview

**Framework:** Next.js 14+ with App Router, TypeScript, Tailwind CSS v4, shadcn/ui  
**Authentication:** Role-based (student, teacher, admin) with localStorage mock  
**State Management:** React hooks with local state  
**Data Flow:** Component-based with prop drilling and mock data  

---

## 📊 Database Schema Reference

Based on [`elms_erd.dot`](elms_erd.dot), the backend should implement these core entities:

### Core Tables
- **users**: id, name, email, password_hash, role, avatar_url, created_at, updated_at
- **courses**: id, title, description, color, created_at, updated_at
- **sections**: id, course_id, teacher_id, name, semester, created_at, updated_at
- **enrollments**: id, user_id, section_id, enrolled_at
- **materials**: id, section_id, title, type, url, upload_date, size
- **assignments**: id, section_id, title, description, due_date, total_marks
- **submissions**: id, assignment_id, student_id, file_url, submitted_at, grade
- **calendar_events**: id, section_id, title, date, type, created_at
- **chat_rooms**: id, section_id, name, created_at
- **chat_messages**: id, room_id, sender_id, message, timestamp
- **notifications**: id, user_id, type, message, read_status, created_at
- **ai_user_context**: id, user_id, context_json, updated_at
- **ai_interactions**: id, user_id, query, response, timestamp
- **progress**: id, student_id, section_id, completion_percentage, last_accessed

---

## 🔐 Authentication APIs

### POST /api/auth/login
**Purpose:** User authentication with role-based routing  
**Frontend:** [`src/components/auth/login-form.tsx`](src/components/auth/login-form.tsx) - `handleSubmit()`

**Request:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "student" // student, teacher, admin
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "student@example.com",
    "role": "student",
    "avatar_url": null
  },
  "token": "jwt_token_here",
  "redirect_url": "/dashboard" // or /dashboard/teacher, /dashboard/admin
}
```

### POST /api/auth/logout
**Purpose:** Clear user session  
**Frontend:** Navigation and theme components

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/session
**Purpose:** Validate current session  
**Frontend:** Layout and route protection

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "student@example.com",
    "role": "student"
  }
}
```

---

## 🎓 Student Dashboard APIs

### GET /api/student/courses
**Purpose:** Get enrolled courses for student  
**Frontend:** [`src/components/course-list.tsx`](src/components/course-list.tsx) - `useEffect()`

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "title": "Advanced React Development",
    "description": "Deep dive into React hooks, context, and performance optimization",
    "teacher": "Dr. Sarah Johnson",
    "enrolledStudents": 45,
    "color": "from-cyan-500 to-blue-500",
    "section": {
      "id": 1,
      "name": "Section A",
      "semester": "Fall 2024"
    }
  }
]
```

### GET /api/student/materials?courseId={id}
**Purpose:** Get materials for specific course  
**Frontend:** [`src/components/material-list.tsx`](src/components/material-list.tsx) - `useEffect()`

**Request:** `Authorization: Bearer {token}`, Query: `courseId=1`  
**Response:**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "React Hooks Deep Dive",
    "type": "pdf", // pdf, docx, pptx, video
    "url": "/api/files/download/1",
    "uploadDate": "2024-03-15T10:00:00Z",
    "size": "2.5 MB"
  }
]
```

### GET /api/student/calendar
**Purpose:** Get calendar events for student  
**Frontend:** [`src/components/calendar-panel.tsx`](src/components/calendar-panel.tsx) - `useEffect()`

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "title": "React Assignment Due",
    "date": "2025-08-20T23:59:00Z",
    "type": "assignment", // assignment, exam, meeting, class
    "courseId": 1,
    "courseName": "Advanced React Development"
  }
]
```

### GET /api/student/chat?roomId={id}
**Purpose:** Get chat messages for section  
**Frontend:** [`src/components/class-chat-panel.tsx`](src/components/class-chat-panel.tsx) - `useEffect()`

**Request:** `Authorization: Bearer {token}`, Query: `roomId=1`  
**Response:**
```json
[
  {
    "id": 1,
    "sender": "Alice Cooper",
    "message": "Has anyone started working on the React assignment yet?",
    "timestamp": "2024-03-15T14:30:00Z",
    "senderRole": "student"
  }
]
```

### POST /api/student/chat/send
**Purpose:** Send chat message  
**Frontend:** [`src/components/class-chat-panel.tsx`](src/components/class-chat-panel.tsx) - `handleSend()`

**Request:**
```json
{
  "roomId": 1,
  "message": "Yes, I'm working on the useEffect hook exercise."
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": 123,
    "sender": "John Doe",
    "message": "Yes, I'm working on the useEffect hook exercise.",
    "timestamp": "2024-03-15T14:35:00Z",
    "senderRole": "student"
  }
}
```

---

## 👨‍🏫 Teacher Dashboard APIs

### GET /api/teacher/courses
**Purpose:** Get courses assigned to teacher  
**Frontend:** [`src/app/dashboard/teacher/page.tsx`](src/app/dashboard/teacher/page.tsx) - Course list

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "title": "Advanced React Development",
    "description": "Deep dive into React hooks, context, and performance optimization",
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "semester": "Fall 2024",
        "studentCount": 45,
        "materialCount": 8
      }
    ]
  }
]
```

### POST /api/teacher/materials/upload
**Purpose:** Upload course material  
**Frontend:** [`src/app/dashboard/teacher/page.tsx`](src/app/dashboard/teacher/page.tsx) - Material upload form

**Request:** `Content-Type: multipart/form-data`
```json
{
  "sectionId": 1,
  "title": "React Hooks Deep Dive",
  "type": "pdf", // pdf, pptx, link
  "file": "binary_file_data", // for pdf/pptx
  "url": "https://youtube.com/watch?v=example" // for links
}
```

**Response:**
```json
{
  "success": true,
  "material": {
    "id": 123,
    "title": "React Hooks Deep Dive",
    "type": "pdf",
    "url": "/api/files/download/123",
    "uploadDate": "2024-03-15T10:00:00Z",
    "size": "2.5 MB"
  }
}
```

### GET /api/teacher/materials?sectionId={id}
**Purpose:** Get materials for teacher's section  
**Frontend:** [`src/app/dashboard/teacher/page.tsx`](src/app/dashboard/teacher/page.tsx) - Materials tab

**Request:** `Authorization: Bearer {token}`, Query: `sectionId=1`  
**Response:** Same as student materials API

### GET /api/teacher/students?sectionId={id}
**Purpose:** Get students in teacher's section  
**Frontend:** [`src/app/dashboard/teacher/page.tsx`](src/app/dashboard/teacher/page.tsx) - Students tab

**Request:** `Authorization: Bearer {token}`, Query: `sectionId=1`  
**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "enrolledAt": "2024-01-15T09:00:00Z",
    "progress": 75
  }
]
```

---

## 👨‍💼 Admin Dashboard APIs

### GET /api/admin/courses
**Purpose:** Get all courses for management  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Courses tab

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "title": "Advanced React Development",
    "description": "Deep dive into React hooks",
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "semester": "Fall 2024",
        "teacher": "Dr. Sarah Johnson",
        "studentCount": 45
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/admin/courses
**Purpose:** Create new course  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Create course form

**Request:**
```json
{
  "title": "Machine Learning Fundamentals",
  "description": "Introduction to ML algorithms and data science",
  "color": "from-purple-500 to-pink-500"
}
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": 123,
    "title": "Machine Learning Fundamentals",
    "description": "Introduction to ML algorithms and data science",
    "color": "from-purple-500 to-pink-500",
    "sections": [],
    "createdAt": "2024-03-15T10:00:00Z"
  }
}
```

### POST /api/admin/sections
**Purpose:** Create new section  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Create section form

**Request:**
```json
{
  "courseId": 1,
  "name": "Section B",
  "semester": "Spring 2024",
  "teacherId": 2
}
```

**Response:**
```json
{
  "success": true,
  "section": {
    "id": 123,
    "courseId": 1,
    "name": "Section B",
    "semester": "Spring 2024",
    "teacher": "Prof. Michael Chen",
    "studentCount": 0,
    "createdAt": "2024-03-15T10:00:00Z"
  }
}
```

### GET /api/admin/teachers
**Purpose:** Get all teachers for assignment  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Teachers tab

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 2,
    "name": "Dr. Sarah Johnson",
    "email": "sarah@university.edu",
    "assignedSections": [
      {
        "sectionId": 1,
        "courseName": "Advanced React Development",
        "sectionName": "Section A"
      }
    ]
  }
]
```

### PUT /api/admin/teachers/{id}/assign
**Purpose:** Assign/reassign teacher to section  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Teacher assignment

**Request:**
```json
{
  "sectionId": 1,
  "previousSectionId": null // if reassigning
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher assigned successfully"
}
```

### GET /api/admin/students
**Purpose:** Get all students for enrollment management  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Students tab

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@student.edu",
    "enrolledSections": [
      {
        "sectionId": 1,
        "courseName": "Advanced React Development",
        "sectionName": "Section A",
        "enrolledAt": "2024-01-15T09:00:00Z"
      }
    ]
  }
]
```

### POST /api/admin/enrollments
**Purpose:** Enroll student in section  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Student enrollment

**Request:**
```json
{
  "studentId": 1,
  "sectionId": 2
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "id": 123,
    "studentId": 1,
    "sectionId": 2,
    "enrolledAt": "2024-03-15T10:00:00Z"
  }
}
```

### DELETE /api/admin/enrollments/{id}
**Purpose:** Remove student from section  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Student removal

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "success": true,
  "message": "Student removed from section successfully"
}
```

### DELETE /api/admin/courses/{id}
**Purpose:** Delete course and all sections  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Course deletion

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### DELETE /api/admin/sections/{id}
**Purpose:** Delete specific section  
**Frontend:** [`src/app/dashboard/admin/page.tsx`](src/app/dashboard/admin/page.tsx) - Section deletion

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "success": true,
  "message": "Section deleted successfully"
}
```

---

## 🤖 AI Assistant APIs

### POST /api/ai/chat
**Purpose:** AI assistant conversation  
**Frontend:** [`src/components/chatbot-panel.tsx`](src/components/chatbot-panel.tsx) - `handleSend()`

**Request:**
```json
{
  "message": "Can you help me understand React hooks?",
  "context": {
    "currentCourse": "Advanced React Development",
    "userRole": "student",
    "previousMessages": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd be happy to help you understand React hooks! React hooks are functions that let you use state and other React features in functional components...",
  "contextUpdated": true
}
```

### GET /api/ai/context
**Purpose:** Get user's AI context  
**Frontend:** [`src/components/chatbot-panel.tsx`](src/components/chatbot-panel.tsx) - `useEffect()`

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "context": {
    "preferences": {},
    "courseHistory": [],
    "commonQuestions": []
  }
}
```

---

## 📁 File Management APIs

### GET /api/files/download/{id}
**Purpose:** Download/stream course materials  
**Frontend:** [`src/components/material-list.tsx`](src/components/material-list.tsx) - Download buttons

**Request:** `Authorization: Bearer {token}`  
**Response:** File stream with appropriate headers:
```
Content-Type: application/pdf (or appropriate MIME type)
Content-Disposition: attachment; filename="react-hooks-guide.pdf"
```

### POST /api/files/upload
**Purpose:** Upload course materials (used by teacher)  
**Frontend:** [`src/app/dashboard/teacher/page.tsx`](src/app/dashboard/teacher/page.tsx) - File upload

**Request:** `Content-Type: multipart/form-data`
- File binary data
- Metadata (title, type, section)

**Response:**
```json
{
  "success": true,
  "fileId": 123,
  "url": "/api/files/download/123",
  "size": "2.5 MB"
}
```

---

## 🔔 Notifications APIs

### GET /api/notifications
**Purpose:** Get user notifications  
**Frontend:** Header/layout components (future implementation)

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
[
  {
    "id": 1,
    "type": "assignment_due",
    "message": "Assignment due in 2 days: React Hooks Exercise",
    "readStatus": false,
    "createdAt": "2024-03-13T10:00:00Z",
    "metadata": {
      "assignmentId": 1,
      "courseId": 1
    }
  }
]
```

### PUT /api/notifications/{id}/read
**Purpose:** Mark notification as read  
**Frontend:** Notification components

**Request:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 🔄 Real-time Features (WebSocket)

### WebSocket: /ws/chat/{roomId}
**Purpose:** Real-time chat functionality  
**Frontend:** [`src/components/class-chat-panel.tsx`](src/components/class-chat-panel.tsx) - WebSocket connection

**Message Format:**
```json
{
  "type": "message",
  "data": {
    "id": 123,
    "sender": "John Doe",
    "message": "Hello everyone!",
    "timestamp": "2024-03-15T14:35:00Z",
    "senderRole": "student"
  }
}
```

### WebSocket: /ws/notifications/{userId}
**Purpose:** Real-time notifications  
**Frontend:** Layout/header components

**Message Format:**
```json
{
  "type": "notification",
  "data": {
    "id": 456,
    "type": "assignment_due",
    "message": "New assignment posted in Advanced React Development",
    "createdAt": "2024-03-15T14:40:00Z"
  }
}
```

---

## 🛡️ Security & Middleware

### Authentication Middleware
- All APIs except `/api/auth/login` require valid JWT token
- Role-based access control for admin/teacher endpoints
- Rate limiting for AI assistant APIs

### File Security
- Virus scanning for uploaded files
- File type validation (PDF, PPTX, DOCX only)
- Size limits (max 50MB per file)
- Secure file storage with access logging

### Data Validation
- Input sanitization for all text fields
- SQL injection prevention
- XSS protection for chat messages
- CSRF tokens for state-changing operations

---

## 📱 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS`: Authentication failed
- `INSUFFICIENT_PERMISSIONS`: Role-based access denied
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `VALIDATION_ERROR`: Input validation failed
- `FILE_TOO_LARGE`: Upload exceeds size limit
- `RATE_LIMIT_EXCEEDED`: Too many requests

---

## 🚀 Implementation Priority

### Phase 1: Core Authentication & Student Features
1. User authentication APIs
2. Student dashboard APIs (courses, materials, calendar)
3. File upload/download system
4. Basic chat functionality

### Phase 2: Teacher Features
1. Teacher dashboard APIs
2. Material upload functionality
3. Section management
4. Student progress tracking

### Phase 3: Admin Features
1. Course/section CRUD operations
2. User assignment APIs
3. System management features
4. Advanced reporting

### Phase 4: Advanced Features
1. Real-time WebSocket connections
2. AI assistant integration
3. Notification system
4. Analytics and reporting

---

## 📋 Frontend Integration Checklist

- [ ] Replace [`src/lib/mock-data.ts`](src/lib/mock-data.ts) with API calls
- [ ] Implement JWT token management
- [ ] Add error handling for all API calls
- [ ] Implement loading states for async operations
- [ ] Add form validation matching backend validation
- [ ] Implement file upload progress indicators
- [ ] Add WebSocket connections for real-time features
- [ ] Implement proper logout functionality
- [ ] Add role-based route protection
- [ ] Implement notification system UI

---

**This comprehensive guide provides everything needed for backend integration. The frontend is designed to be easily connected to these APIs with minimal code changes.**