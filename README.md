# ELMS - E-Learning Management System

A comprehensive full-stack e-learning platform built with **Express.js/TypeScript backend** and **Next.js/React frontend**, designed for modern educational institutions.

## 🎯 Current Status: Phase 3 COMPLETE ✅

### ✅ **Fully Implemented & Working**
- **Complete Authentication System** with JWT and role-based access
- **Admin Management Dashboard** with full CRUD operations
- **Teacher & Student Profile Management** with detailed views
- **Course Management System** with enrollment tracking
- **Real-time Toast Notifications** for user feedback
- **Theme-Aware UI** supporting both light and dark modes
- **Responsive Modal System** for profile and course details

## 🚀 Features Implemented

### **Backend (Express.js + TypeScript)**
- ✅ JWT Authentication with role-based authorization
- ✅ Complete Admin API suite with 15+ endpoints
- ✅ MySQL database integration with optimized queries  
- ✅ Input validation using Joi middleware
- ✅ CORS configuration for multi-port development
- ✅ Error handling and TypeScript compliance
- ✅ Profile and detailed view APIs
- ✅ Course, teacher, and student management

### **Frontend (Next.js + React + TypeScript)**
- ✅ Modern admin dashboard with real API integration
- ✅ Toast notification system using Radix UI
- ✅ Profile viewing modals for teachers and students
- ✅ Course detail views with enrolled students table
- ✅ Theme-aware design with consistent styling
- ✅ Responsive UI with proper state management
- ✅ Real-time data loading and error handling

### **Database Schema**
- ✅ Complete MySQL schema with proper relationships
- ✅ Enhanced course table with academic fields
- ✅ User management with role-based access
- ✅ Enrollment and assignment tracking
- ✅ Material and content management structure

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

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd elms

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Configure your MySQL connection in .env

# Set up database
mysql -u root -p < database_creation.sql
mysql -u root -p < fake_data_insert.sql

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

### Test Credentials
**Admin:**
- Email: `admin.aminul@uiu.ac.bd`
- Password: `password123`

**Teacher:**
- Email: `sarah.johnson@uiu.ac.bd`
- Password: `password123`

**Student:**
- Email: `sakib221131@bscse.uiu.ac.bd`
- Password: `password123`

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

