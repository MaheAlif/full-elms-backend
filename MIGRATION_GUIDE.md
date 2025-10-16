# 🚀 ELMS Migration Guide - Setup on New PC

## ✅ Database Cleanup Completed!

Your database has been cleaned and is ready for migration. Here's what was done:

### 📊 Cleanup Summary:
- ✅ Removed 12 old 2024 assignments (Sept-Nov 2024)
- ✅ Removed 18 old 2024 calendar events
- ✅ Removed 6 test university events
- ✅ Fixed Economics course teacher assignment (now assigned to Dr. Emily Rodriguez)
- ✅ Kept all users (including Debug User and Test User as requested)
- ✅ Kept all recent 2025 assignments (including test-1, Biology A-1 Lab, etc.)

### 📦 Export Summary:
- **File**: `elms_clean_export.sql` (58.96 KB)
- **Location**: Root of project directory
- **33 users** (2 admins, 7 teachers, 24 students)
- **10 courses** (all with assigned teachers)
- **15 sections**
- **101 enrollments**
- **7 materials** (PDFs)
- **6 assignments** (all from 2025)
- **6 submissions** (recent submissions)
- **6 calendar events** (2025 events)
- **8 university events** (meaningful events only)
- **14 chat rooms**
- **39 chat messages** (recent 100 messages)

---

## 📋 Files Needed for Migration

### 1. **Database Export**
- ✅ `elms_clean_export.sql` - Complete database with clean data

### 2. **Backend Files**
```
elms/
├── src/                    # Backend source code
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── .env                    # Environment variables (CREATE NEW!)
└── uploads/                # Important: Copy this folder!
    ├── materials/          # Course materials (PDFs)
    └── submissions/        # Student submissions
```

### 3. **Frontend Files**
```
elms-uiu/
├── src/                    # Frontend source code
├── package.json            # Dependencies
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config
└── .env.local              # Environment variables (CREATE NEW!)
```

---

## 🔧 Step-by-Step Setup on New PC

### **Step 1: Install Prerequisites**

#### Windows:
1. Install **Node.js 18+**: https://nodejs.org
2. Install **MySQL 8.0+**: https://dev.mysql.com/downloads/installer/
3. Install **Git**: https://git-scm.com

#### macOS:
```bash
# Using Homebrew
brew install node
brew install mysql
brew install git
```

#### Linux:
```bash
sudo apt update
sudo apt install nodejs npm mysql-server git
```

---

### **Step 2: Copy Project Files**

Transfer these to your new PC:
1. The entire `elms/` folder
2. The entire `elms-uiu/` folder
3. The `elms_clean_export.sql` file

---

### **Step 3: Setup Database**

#### Windows (PowerShell):
```powershell
# Start MySQL service (if not running)
net start MySQL80

# Import database
cd path\to\your\project
mysql -u root -p < elms_clean_export.sql
# Enter your MySQL root password when prompted
```

#### macOS/Linux:
```bash
# Start MySQL (if not running)
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS

# Import database
cd path/to/your/project
mysql -u root -p < elms_clean_export.sql
# Enter your MySQL root password when prompted
```

#### Verify Database:
```bash
mysql -u root -p elms
# Then run:
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM courses;
exit;
```

You should see:
- 15 tables
- 33 users
- 10 courses

---

### **Step 4: Configure Environment Variables**

#### Backend `.env` (in `elms/` folder):
Create a new `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=elms

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a new one!)
JWT_SECRET=your_secure_random_string_here

# OpenRouter API Key (optional - for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5000
```

#### Frontend `.env.local` (in `elms-uiu/` folder):
Create a new `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**⚠️ IMPORTANT:** 
- Change `DB_PASSWORD` to your actual MySQL password
- Generate a new `JWT_SECRET` (use a random string generator)
- If you have an OpenRouter API key, add it for AI features

---

### **Step 5: Install Dependencies**

#### Backend:
```bash
cd elms
npm install
```

#### Frontend:
```bash
cd elms-uiu
npm install
```

---

### **Step 6: Copy Uploaded Files**

**IMPORTANT:** Copy the `uploads/` folder from your old PC to the new PC:

```
Old PC: elms/uploads/
  ├── materials/
  │   ├── 50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced-1760371201561-298032114.pdf
  │   ├── Equilibrium Under Monopoly-1760632601148-464913508.pdf
  │   └── ... (7 files total)
  └── submissions/
      ├── Mahe Alif_test-1-1760638808191-311450421.pdf
      └── ... (6 files total)

Copy to → New PC: elms/uploads/
```

If you don't copy this folder, materials and submissions won't be accessible!

---

### **Step 7: Start the Servers**

#### Terminal 1 - Backend:
```bash
cd elms
npm run dev
```
Should see: `🚀 ELMS Backend Server running on port 5000`

#### Terminal 2 - Frontend:
```bash
cd elms-uiu
npm run dev
```
Should see: `✓ Ready on http://localhost:3000`

---

### **Step 8: Verify Setup**

1. **Open browser**: http://localhost:3000

2. **Test Login** with these accounts:

   **Admin:**
   - Email: `admin.aminul@uiu.ac.bd`
   - Password: `password123`

   **Teacher:**
   - Email: `sarah.johnson@uiu.ac.bd`
   - Password: `password123`

   **Student (Your Account):**
   - Email: `mahe221130@bscse.uiu.ac.bd`
   - Password: `password123`

3. **Verify Features:**
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Can see courses
   - ✅ Can download materials
   - ✅ Can view assignments
   - ✅ Chat works
   - ✅ Can view calendar

---

## 🎯 What's Included in the Export

### **Users (33 total):**
- **2 Admins**: Dr. Aminul Islam, Prof. Rashida Khatun
- **7 Teachers**: Dr. Sarah Johnson, Prof. Michael Chen, Golam Rabbani, Prof. David Kim, Dr. Emily Rodriguez, Prof. Ahmed Hassan, Dr. Fatima Rahman
- **24 Students**: Including Mahe Alif, Mark Protik, Aminul Islam, Sakib Islam, Fatima Akter, Debug User, Test User, and 17 others

### **Courses (10 total):**
1. CSE-4101 - Advanced React Development (Dr. Sarah Johnson)
2. CSE-4201 - Machine Learning Fundamentals (Prof. Michael Chen)
3. CSE-3301 - Database Design & SQL (Golam Rabbani)
4. CSE-4401 - Web Security & Cryptography (Prof. David Kim)
5. CSE-2501 - Data Structures & Algorithms (Dr. Fatima Rahman)
6. CSE-3601 - Software Engineering Principles (Prof. Ahmed Hassan)
7. Bio-201 - Biology (Dr. Sarah Johnson)
8. Psy-231 - Psychology (Dr. Emily Rodriguez)
9. CSE-2201 - Data Structures and Algorithms (Dr. Sarah Johnson)
10. ECO-2011 - Economics (Dr. Emily Rodriguez) ← **Fixed!**

### **Assignments (6 active assignments for 2025):**
- A-TT-1 (Psychology) - Due: Oct 18, 2025
- Biology Lab Report - Due: Oct 25, 2025
- T-1 (Economics) - Due: Oct 27, 2025
- Biology A-1 Lab - Due: Oct 27, 2025
- test-1 (React) - Due: Oct 30, 2025
- Report on Human Cell - Due: Oct 30, 2025

### **University Events (8 meaningful events):**
- Fall Semester Registration - Aug 15, 2025
- New Student Orientation - Sep 1, 2025
- Mid-term Exam Week - Oct 14, 2025
- System Maintenance - Nov 15, 2025
- Annual Sports Day - Dec 10, 2025
- Final Exam Period - Dec 15, 2025
- Winter Break Begins - Dec 25, 2025
- Independence Day Holiday - Mar 26, 2025

---

## 🗑️ What Was Removed

### **Old 2024 Data Removed:**
- ❌ 12 sample assignments from Sept-Nov 2024
- ❌ 19 sample submissions from Sept 2024
- ❌ 18 calendar events from Oct-Nov 2024

### **Test Events Removed:**
- ❌ "test event" (Oct 20, 2025)
- ❌ "test event 2" (Oct 22, 2025)
- ❌ "Final exam begins" (Oct 24, 2025)
- ❌ "2nd final exam" (Oct 25, 2025)
- ❌ "Meet" (Oct 30, 2025)
- ❌ "Meet-2" (Oct 31, 2025)

### **What We Kept (As Requested):**
- ✅ Debug User and Test User (not removed)
- ✅ All recent 2025 assignments (test-1, Biology A-1 Lab, etc.)
- ✅ All production data

---

## ⚠️ Important Notes

1. **Password Hash**: All users have password `password123`. The password hashes are preserved, so passwords will work immediately.

2. **File Paths**: Material and submission file paths are preserved. Make sure to copy the `uploads/` folder!

3. **Auto-increment IDs**: Configured to continue from current max ID, so new records won't conflict.

4. **Chat Messages**: Only the 39 most recent messages are included. Old chat history was excluded for a cleaner migration.

5. **Database Name**: The export creates/uses a database named `elms`. If you want a different name, edit the SQL file.

---

## 🐛 Troubleshooting

### Database Import Fails
```bash
# Check MySQL is running
mysql -u root -p
# If fails, start MySQL service first
```

### Backend Won't Start
- Check `.env` file exists and has correct MySQL password
- Verify database was imported: `mysql -u root -p elms`
- Check port 5000 is not in use

### Frontend Won't Start
- Check `.env.local` file exists
- Verify backend is running on port 5000
- Check port 3000 is not in use

### Materials/Submissions Not Loading
- Copy the `uploads/` folder from old PC
- Check file paths in database match actual files
- Verify folder permissions

### "Teacher can't grade submissions" Error
- This was fixed! Economics course now has a teacher.
- If still happening, check backend logs for errors.

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can login as admin
- [ ] Can login as teacher
- [ ] Can login as student
- [ ] Can see all courses
- [ ] Can download materials (PDFs)
- [ ] Can view assignments
- [ ] Can submit assignments (student)
- [ ] Can grade submissions (teacher)
- [ ] Chat works in courses
- [ ] Calendar shows events
- [ ] All 33 users exist
- [ ] All 10 courses have teachers

---

## 📞 Need Help?

If something doesn't work:
1. Check the troubleshooting section above
2. Review the `.env` files (correct passwords?)
3. Check both terminals for error messages
4. Verify database imported correctly

---

## 🎉 Success!

Once everything is working, you have successfully migrated your ELMS system to a new PC with:
- ✅ Clean, production-ready database
- ✅ All users, courses, and enrollments
- ✅ Recent assignments and submissions
- ✅ Meaningful events only
- ✅ No test data clutter

**Your ELMS system is ready to use!** 🚀

---

Generated: October 17, 2025
Database: elms (Clean Export)
Version: Production Ready
