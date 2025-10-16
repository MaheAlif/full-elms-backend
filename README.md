# 🎓 ELMS - E-Learning Management System

> A comprehensive, production-ready full-stack e-learning platform built with **Express.js/TypeScript backend** and **Next.js 15/React 19 frontend**, featuring real-time communication, AI-powered learning assistance, and modern educational tools.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101.svg)](https://socket.io/)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Current Status](#-current-status)
- [User Roles & Capabilities](#-user-roles--capabilities)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Installation & Setup](#-installation--setup)
- [Testing & Credentials](#-testing--credentials)
- [Project Structure](#-project-structure)
- [Development Roadmap](#-development-roadmap)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ELMS (E-Learning Management System)** is a modern, full-featured educational platform designed to facilitate seamless interaction between administrators, teachers, and students. Built with cutting-edge technologies, it provides a robust foundation for online education with features like real-time chat, AI-powered assistance, comprehensive assignment management, and intuitive user interfaces.

### Why ELMS?

- **🎯 Role-Based Access Control**: Three distinct user roles (Admin, Teacher, Student) with tailored dashboards
- **💬 Real-Time Communication**: Socket.IO-powered class chat with typing indicators and presence detection
- **🤖 AI Integration**: OpenRouter API integration for intelligent learning assistance
- **📊 Comprehensive Analytics**: Detailed statistics and progress tracking
- **🎨 Modern UI/UX**: Dark/light theme support with glassmorphism effects
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🚀 Production Ready**: Clean, scalable codebase with TypeScript throughout

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- **JWT-based Authentication** with secure token management
- **Role-Based Access Control** (RBAC) for Admin, Teacher, and Student
- **Password Hashing** using bcrypt with salt rounds
- **Session Management** with token validation
- **Profile Management** with avatar support

### 👨‍💼 **Admin Dashboard**
- **User Management**: Create, update, delete users (teachers and students)
- **Course Management**: Full CRUD operations for courses with rich metadata
- **Section Management**: Create and assign sections to courses
- **Teacher Assignment**: Assign teachers to courses and sections
- **Enrollment Management**: Enroll students in sections with capacity tracking
- **System Statistics**: Real-time dashboard with user counts, course stats, and activity metrics
- **University Events**: Create and manage university-wide events (registration, exams, holidays)
- **Notifications**: Broadcast system-wide notifications to users
- **Profile Views**: Detailed teacher and student profiles with course history

### 👨‍🏫 **Teacher Dashboard**
- **Course Overview**: View all assigned courses with student counts and material statistics
- **Material Management**: Upload, organize, and delete course materials (PDF, DOC, PPT, video)
- **Assignment Management**: 
  - Create assignments with titles, descriptions, due dates, and total marks
  - Track submission status (submitted, pending, overdue)
  - View detailed submission statistics
  - Auto-create calendar events for assignment deadlines
- **Grading System**:
  - Grade student submissions with numerical scores
  - Provide detailed text feedback
  - Track grading progress (graded vs. ungraded)
  - Download student submission files
  - View submission timestamps and late penalties
- **Student Management**: View enrolled students with enrollment details
- **Section Management**: Manage course sections and view section-specific data
- **Calendar Management**: Create and manage section-specific events
- **Real-Time Chat**: Participate in course-specific chat rooms
- **Notifications**: Receive and manage assignment-related notifications

### 🎓 **Student Dashboard**
- **Course Enrollment**: View all enrolled courses with teacher information
- **Material Access**: Browse and download course materials by course
- **Assignment Submission**:
  - View all assignments with due dates and descriptions
  - Submit assignments with file uploads
  - Resubmit assignments before deadline
  - Track submission status (submitted, pending, overdue, graded)
  - View days remaining/late indicators
- **Grade Viewing**:
  - View grades and detailed feedback from teachers
  - Track overall course performance
  - See grading timestamps
- **Calendar Integration**:
  - View assignment deadlines
  - See course events and exams
  - View university-wide events
- **AI Learning Assistant**:
  - Context-aware chatbot powered by OpenRouter
  - Course-specific help and explanations
  - Interaction history tracking
- **Real-Time Class Chat**:
  - Participate in course-specific discussions
  - Real-time message delivery
  - Typing indicators
  - Message deletion (own messages)
- **Profile Management**: View and update personal information

### 💬 **Real-Time Communication**
- **Socket.IO Integration** for instant messaging
- **Course-Specific Chat Rooms** with section isolation
- **Message Features**:
  - Real-time message broadcasting
  - Message persistence in database
  - Typing indicators
  - User presence detection (joined/left notifications)
  - Message deletion
  - Auto-scroll to latest messages
- **Connection Status**: Visual indicators for connection state
- **Enrollment Verification**: Automatic access control based on course enrollment
- **Participant List**: View all active chat participants

### 🤖 **AI Learning Assistant**
- **OpenRouter API Integration** for advanced AI capabilities
- **Context-Aware Responses** using user and course context
- **Interaction History** stored in database
- **User Context Management** for personalized assistance
- **Course-Specific Help** tailored to enrolled courses

### 📊 **Advanced Features**
- **File Upload System**:
  - Multer-based file handling
  - Support for PDF, DOCX, PPTX, videos
  - File size validation
  - Secure file storage with unique naming
- **Calendar System**:
  - Assignment deadlines auto-added to calendar
  - Section-specific events
  - University-wide events (registration, exams, holidays)
  - Color-coded event types
  - Priority levels for important events
- **Notification System**:
  - Real-time notifications for important events
  - Assignment deadlines reminders
  - Grade posted notifications
  - System announcements
  - Read/unread status tracking
- **Search & Filtering**:
  - Filter assignments by status
  - Search users by role and name
  - Filter materials by course/section
  - Advanced course filtering
- **Analytics & Reporting**:
  - System-wide statistics (admin)
  - Course enrollment metrics
  - Assignment submission rates
  - Grading progress tracking
  - User activity monitoring

### 🎨 **User Interface**
- **Modern Design**: Glassmorphism effects with gradient backgrounds
- **Theme Support**: Light and dark mode with smooth transitions
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Components**:
  - Modal dialogs for profiles and course details
  - Toast notifications for user feedback
  - Loading states and skeletons
  - Error boundaries
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering with React 19 features

## 📁 Project Structure

```
elms/
├── src/                     # Express.js Backend
│   ├── controllers/         # API route handlers
│   ├── middleware/          # Authentication, validation
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── utils/              # Database and utilities
│   └── app.ts              # Express app setup
├── elms-uiu/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Next.js 13+ app directory
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # API client and utilities
│   │   └── types/          # TypeScript definitions
├── database_creation.sql   # Database schema
├── fake_data_insert.sql   # Test data
└── docs/                  # Documentation files
```

## 🛠 Tech Stack

**Backend:**
- Express.js with TypeScript
- MySQL with mysql2 driver
- JWT authentication
- Joi validation
- Multer for file uploads
- CORS and security middleware

**Frontend:**
- Next.js 13+ (App Directory)
- React with TypeScript
- Tailwind CSS
- Radix UI components
- Custom hooks and context

**Database:**
- MySQL with optimized schema
- Proper indexing and relationships
- Transaction support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### 📦 Quick Setup (Automated)

#### **Windows (PowerShell)**
```powershell
# Navigate to project directory
cd elms

# Run automated setup script
.\setup_database.ps1
```

#### **macOS/Linux (Bash)**
```bash
# Navigate to project directory
cd elms

# Make script executable
chmod +x setup_database.sh

# Run automated setup script
./setup_database.sh
```

#### **Manual Setup (All Platforms)**
```bash
# Run the all-in-one SQL script
mysql -u root -p < setup_complete_database.sql
```

📖 **For detailed setup instructions, see [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)**

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd elms

# Install dependencies
npm install

# Configure environment variables
# Create .env file with the following:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=elms
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=your-openrouter-api-key

# Database is already set up from automated script above!

# Start backend server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
# Navigate to frontend
cd elms-uiu

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

## 🧪 Testing

### 🔑 Default Login Credentials

**All users have password:** `password123`

**Your Account (Student):**
- Email: `mahealif221031@bscse.uiu.ac.bd`
- Password: `password123`
- Enrolled in: Economics

**Admin:**
- Email: `admin.aminul@uiu.ac.bd`
- Password: `password123`

**Teacher:**
- Email: `sarah.johnson@uiu.ac.bd`
- Password: `password123`
- Teaches: Economics Section A

**Other Students:**
- Email: `sakib221131@bscse.uiu.ac.bd`
- Email: `fatima221132@bscse.uiu.ac.bd`
- ... and 18 more students

### Backend API Testing
```bash
# Run comprehensive test suite
cd tests
node test-admin-comprehensive.js
```

## 📊 API Documentation

### Admin Endpoints
- `POST /api/auth/login` - Authentication
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/courses` - Course management
- `POST /api/admin/courses` - Create course
- `GET /api/admin/teachers/:id/profile` - Teacher details
- `GET /api/admin/students/:id/profile` - Student details
- `GET /api/admin/courses/:id/details` - Course details with enrollments

*See `backend-implementation-plan.md` for complete API documentation.*

## 🔄 Development Status

### ✅ Completed Phases
- **Phase 1**: Foundation & Database Setup
- **Phase 2**: Authentication & Security  
- **Phase 3**: Complete Admin Management System

### 🔄 Next Phases
- **Phase 4**: Teacher Dashboard APIs
- **Phase 5**: Student Portal APIs
- **Phase 6**: Real-time Chat System
- **Phase 7**: AI Integration

## 📖 Documentation

- [`backend-implementation-plan.md`](backend-implementation-plan.md) - Complete backend roadmap
- [`frontend-integration-complete.md`](frontend-integration-complete.md) - Frontend implementation guide
- [`phase3-completion-report.md`](phase3-completion-report.md) - Detailed completion report
- [`database_creation.sql`](database_creation.sql) - Database schema
- [`ERD.png`](ERD.png) - Entity relationship diagram

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment and follows university guidelines.

---

**Last Updated**: October 3, 2025  
**Current Version**: Phase 3 Complete - Full Admin System  
**Status**: ✅ Production Ready for Admin Features

