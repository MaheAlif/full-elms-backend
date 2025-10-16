# ELMS Database Setup Guide

Complete guide to set up the ELMS database on any MySQL server.

## 📋 Prerequisites

- MySQL Server 5.7 or higher (8.0+ recommended)
- MySQL client or MySQL Workbench
- Administrator access to MySQL server

## 🚀 Quick Setup (Automated)

### Option 1: Command Line (Recommended)

```bash
# Navigate to the project directory
cd c:\Users\mahee\Documents\Project\elms

# Run the complete setup script
mysql -u root -p < setup_complete_database.sql
```

### Option 2: MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Select `setup_complete_database.sql`
5. Click Execute (⚡ icon)

## 📊 What Gets Created

The script will automatically:

1. **Drop and recreate** the `elms` database
2. **Create 17 tables**:
   - users
   - courses
   - sections
   - enrollments
   - announcements
   - materials
   - assignments
   - submissions
   - calendar_events
   - university_events
   - chat_rooms
   - chat_messages
   - notifications
   - ai_user_context
   - ai_interactions

3. **Populate with realistic data**:
   - 31 users (2 admins, 6 teachers, 23 students)
   - 8 courses across different subjects
   - 11 sections (including section-level teacher assignments)
   - 60+ enrollments
   - 12 announcements
   - 22 study materials
   - 14 assignments
   - 9 submissions (some graded, some pending)
   - 12 calendar events
   - 8 university-wide events
   - 11 chat rooms with messages
   - Multiple notifications
   - AI context and interaction history

## 👥 Default Users

All users have the default password: **`password123`**

### Admins
- **Email**: admin.aminul@uiu.ac.bd
- **Email**: admin.rashida@uiu.ac.bd

### Teachers
- **Email**: sarah.johnson@uiu.ac.bd (ID: 3)
- **Email**: michael.chen@uiu.ac.bd (ID: 4)
- **Email**: emily.rodriguez@uiu.ac.bd (ID: 5)
- **Email**: david.kim@uiu.ac.bd (ID: 6)
- **Email**: fatima.rahman@uiu.ac.bd (ID: 7)
- **Email**: ahmed.hassan@uiu.ac.bd (ID: 8)

### Students
- **Email**: mahealif221031@bscse.uiu.ac.bd (ID: 29) - Your account
- **Email**: sakib221131@bscse.uiu.ac.bd (ID: 9)
- **Email**: fatima221132@bscse.uiu.ac.bd (ID: 10)
- ... and 18 more students

## 🔐 Database Connection Details

Update your `.env` file with these settings:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=elms
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenRouter AI Configuration
OPENROUTER_API_KEY=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
AI_MODEL=z-ai/glm-4.5-air:free
AI_BASE_URL=https://openrouter.ai/api/v1
```

## ✅ Verification

After running the setup script, you should see:

```
✅ Database setup complete!
Default password for all users: password123
```

And a summary table showing:
- 31 total users
- 8 courses
- 11 sections
- 60+ enrollments
- 14 assignments
- 9 submissions
- 22 materials
- And more...

## 🧪 Test the Setup

### Backend Test
```bash
# Navigate to backend directory
cd c:\Users\mahee\Documents\Project\elms

# Install dependencies (if not already done)
npm install

# Start the backend server
npm run dev
```

Server should start on `http://localhost:5000`

### Frontend Test
```bash
# Navigate to frontend directory
cd c:\Users\mahee\Documents\Project\elms\elms-uiu

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

Frontend should start on `http://localhost:3000`

### Login Test

1. Open `http://localhost:3000/login`
2. Try logging in with:
   - **Email**: `mahealif221031@bscse.uiu.ac.bd`
   - **Password**: `password123`

You should be able to:
- ✅ View your enrolled courses (Economics)
- ✅ See study materials
- ✅ View assignments
- ✅ Access AI Assistant
- ✅ Participate in class chat

## 📁 File Structure

The database setup is organized as follows:

```
elms/
├── setup_complete_database.sql  ← ALL-IN-ONE SETUP SCRIPT (USE THIS!)
├── DATABASE_SETUP_GUIDE.md      ← This file
├── sql/                          ← Individual migration scripts (for reference)
│   ├── database_creation.sql
│   ├── fake_data_insert.sql
│   ├── database_schema_sections_fix.sql
│   ├── add_university_events_table.sql
│   └── ...
```

## 🔧 Troubleshooting

### Error: "Database already exists"
The script automatically drops the existing database. If you get this error:
```sql
DROP DATABASE IF EXISTS elms;
CREATE DATABASE elms;
```

### Error: "Access denied"
Make sure you're using a MySQL user with sufficient privileges:
```bash
mysql -u root -p
```

### Error: "Unknown database 'elms'"
The script creates the database automatically. Make sure you run the entire script.

### Connection refused
1. Check if MySQL service is running:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo systemctl start mysql
   ```

2. Verify MySQL port (default: 3306)
3. Check firewall settings

## 🔄 Resetting the Database

To completely reset and start fresh:

```bash
# Simply run the setup script again
mysql -u root -p < setup_complete_database.sql
```

The script will:
1. Drop the existing database
2. Create a fresh database
3. Recreate all tables
4. Repopulate with data

## 📞 Support

If you encounter any issues:

1. Check MySQL error logs
2. Verify your MySQL version: `mysql --version`
3. Ensure MySQL service is running
4. Verify your database credentials in `.env`

## 🎯 Next Steps

After database setup:

1. ✅ Update `.env` files (backend and frontend)
2. ✅ Install dependencies: `npm install`
3. ✅ Start backend: `npm run dev` (in root directory)
4. ✅ Start frontend: `npm run dev` (in elms-uiu directory)
5. ✅ Login and test the application

## 📚 Database Schema Overview

### Core Tables
- **users**: Authentication and user profiles
- **courses**: Course information
- **sections**: Course sections with teacher assignments
- **enrollments**: Student-section relationships

### Learning Materials
- **materials**: Study materials (PDFs, videos, etc.)
- **assignments**: Coursework assignments
- **submissions**: Student assignment submissions

### Communication
- **chat_rooms**: Section-based chat rooms
- **chat_messages**: Real-time class discussions
- **announcements**: Course announcements
- **notifications**: User notifications

### Calendar
- **calendar_events**: Course-specific events
- **university_events**: University-wide events

### AI Features
- **ai_user_context**: Student learning context
- **ai_interactions**: AI chat history

## 🔑 Key Features

- ✅ Section-based architecture (teachers can be assigned at course OR section level)
- ✅ Complete grading system (feedback, graded_at, graded_by)
- ✅ Real-time chat with Socket.IO support
- ✅ AI Learning Assistant integration
- ✅ Calendar with dual-level events (course + university)
- ✅ Material management with file uploads
- ✅ Comprehensive notification system

---

**Version**: 1.0.0  
**Last Updated**: October 16, 2024  
**Author**: ELMS Development Team
