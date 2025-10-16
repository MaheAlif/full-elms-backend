# 🎨 ELMS Visual Setup Guide

A visual, step-by-step guide to set up ELMS on any computer.

---

## 📋 Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   New Computer → Install Prerequisites → Setup Database     │
│                                                              │
│   → Configure Backend → Start Backend → Configure Frontend  │
│                                                              │
│   → Start Frontend → Login & Test → ✅ Done!                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Estimated Time**: 15-30 minutes

---

## Step 1: Install Prerequisites

### Required Software

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Node.js     │    │     MySQL     │    │      Git      │
│   v18.0+      │    │     8.0+      │    │     2.0+      │
└───────────────┘    └───────────────┘    └───────────────┘
     ⬇️ Download          ⬇️ Download          ⬇️ Download
  nodejs.org         mysql.com          git-scm.com
```

### Verify Installation

```bash
┌─────────────────────────────────────────────────┐
│ $ node --version                                 │
│ v18.17.0  ✅                                     │
│                                                  │
│ $ npm --version                                  │
│ v9.6.7  ✅                                       │
│                                                  │
│ $ mysql --version                                │
│ mysql  Ver 8.0.33  ✅                            │
│                                                  │
│ $ git --version                                  │
│ git version 2.41.0  ✅                           │
└─────────────────────────────────────────────────┘
```

---

## Step 2: Get the Project

### Option A: Clone from GitHub

```
┌─────────────────────────────────────────────────┐
│ $ git clone <your-repo-url>                     │
│ Cloning into 'elms'...                          │
│ remote: Counting objects: 1542, done.           │
│ remote: Compressing objects: 100% (847/847)     │
│ Receiving objects: 100% (1542/1542), done.      │
│ ✅ Clone complete!                              │
│                                                  │
│ $ cd elms                                        │
└─────────────────────────────────────────────────┘
```

### Option B: Copy Folder

```
┌─────────────────────────────────────────────────┐
│  📁 USB Drive / Cloud                            │
│  └─ 📁 elms/                                     │
│      ├─ 📄 setup_complete_database.sql          │
│      ├─ 📄 setup_database.ps1                   │
│      ├─ 📁 src/                                  │
│      ├─ 📁 elms-uiu/                             │
│      └─ ... all files                           │
│                                                  │
│  Copy to: C:\Users\YourName\Documents\elms\     │
│  ✅ Copy complete!                              │
└─────────────────────────────────────────────────┘
```

---

## Step 3: Setup Database (Automated)

### Windows PowerShell

```
┌─────────────────────────────────────────────────┐
│ C:\...\elms> .\setup_database.ps1               │
│ ========================================         │
│    ELMS Database Setup Script                   │
│ ========================================         │
│                                                  │
│ ✅ MySQL found: C:\...\mysql.exe                │
│                                                  │
│ Enter MySQL credentials:                        │
│ MySQL Username (default: root): root_           │
│ MySQL Password: ******                          │
│                                                  │
│ ✅ MySQL connection successful!                 │
│                                                  │
│ ⚠️  WARNING: This will DROP existing database   │
│ Do you want to continue? (yes/no): yes_         │
│                                                  │
│ Setting up ELMS database...                     │
│ ████████████████████████ 100%                   │
│                                                  │
│ ========================================         │
│    ✅ Database Setup Complete!                  │
│ ========================================         │
│                                                  │
│ Database Details:                               │
│   📊 Database Name: elms                        │
│   👥 Total Users: 31                            │
│   📚 Total Courses: 8                           │
│   🎓 Total Sections: 11                         │
│                                                  │
│ Default Login:                                  │
│   📧 mahealif221031@bscse.uiu.ac.bd             │
│   🔑 password123                                │
└─────────────────────────────────────────────────┘
```

### macOS/Linux Bash

```
┌─────────────────────────────────────────────────┐
│ $ chmod +x setup_database.sh                    │
│ $ ./setup_database.sh                           │
│ ========================================         │
│    ELMS Database Setup Script                   │
│ ========================================         │
│                                                  │
│ ✅ MySQL found: /usr/local/bin/mysql            │
│                                                  │
│ Enter MySQL credentials:                        │
│ MySQL Username (default: root): root_           │
│ MySQL Password: [hidden input]                  │
│                                                  │
│ ✅ MySQL connection successful!                 │
│                                                  │
│ [Same output as Windows]                        │
│ ✅ Database Setup Complete!                     │
└─────────────────────────────────────────────────┘
```

---

## Step 4: Configure Backend

### Create .env File

```
┌─────────────────────────────────────────────────┐
│ 📁 elms/                                         │
│ └─ 📄 .env  ← Create this file                  │
│                                                  │
│ Contents:                                        │
│ ┌─────────────────────────────────────────────┐ │
│ │ DB_HOST=localhost                           │ │
│ │ DB_USER=root                                │ │
│ │ DB_PASSWORD=your_mysql_password             │ │
│ │ DB_NAME=elms                                │ │
│ │ JWT_SECRET=your-secret-key-here             │ │
│ │ OPENROUTER_API_KEY=sk-or-v1-...            │ │
│ │ PORT=5000                                   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Install Dependencies

```
┌─────────────────────────────────────────────────┐
│ C:\...\elms> npm install                         │
│                                                  │
│ Installing packages...                          │
│ ⬇️  express@4.18.2                              │
│ ⬇️  mysql2@3.6.1                                │
│ ⬇️  jsonwebtoken@9.0.2                          │
│ ⬇️  socket.io@4.8.1                             │
│ ... (50+ packages)                              │
│                                                  │
│ ✅ Installed 237 packages in 45s                │
└─────────────────────────────────────────────────┘
```

---

## Step 5: Start Backend

```
┌─────────────────────────────────────────────────┐
│ C:\...\elms> npm run dev                         │
│                                                  │
│ > elms-backend@1.0.0 dev                        │
│ > nodemon src/app.ts                            │
│                                                  │
│ [nodemon] starting `ts-node src/app.ts`         │
│ 🚀 Server is running on port 5000               │
│ ✅ Database connected successfully              │
│ ✅ Socket.IO initialized                        │
│ ✅ All routes registered                        │
│                                                  │
│ API Available at:                               │
│ 🌐 http://localhost:5000                        │
│                                                  │
│ [Keep this terminal open!]                      │
└─────────────────────────────────────────────────┘
```

### Test Backend

```
┌─────────────────────────────────────────────────┐
│ Open new terminal:                              │
│                                                  │
│ $ curl http://localhost:5000/api/health         │
│ {"status":"OK","timestamp":"2024-10-16..."}     │
│ ✅ Backend is working!                          │
└─────────────────────────────────────────────────┘
```

---

## Step 6: Configure Frontend

### Navigate to Frontend

```
┌─────────────────────────────────────────────────┐
│ Open NEW terminal (keep backend running!)       │
│                                                  │
│ C:\...\elms> cd elms-uiu                         │
└─────────────────────────────────────────────────┘
```

### Install Dependencies

```
┌─────────────────────────────────────────────────┐
│ C:\...\elms\elms-uiu> npm install                │
│                                                  │
│ Installing packages...                          │
│ ⬇️  next@15.0.4                                 │
│ ⬇️  react@19.0.0                                │
│ ⬇️  typescript@5.9.2                            │
│ ... (100+ packages)                             │
│                                                  │
│ ✅ Installed 412 packages in 1m 23s             │
└─────────────────────────────────────────────────┘
```

---

## Step 7: Start Frontend

```
┌─────────────────────────────────────────────────┐
│ C:\...\elms-uiu> npm run dev                     │
│                                                  │
│   ▲ Next.js 15.0.4                              │
│   - Local:        http://localhost:3000         │
│   - Environments: .env.local                    │
│                                                  │
│  ✓ Ready in 2.3s                                │
│  ○ Compiling / ...                              │
│  ✓ Compiled / in 3.2s                           │
│                                                  │
│ 🌐 Frontend available at:                       │
│ http://localhost:3000                           │
│                                                  │
│ [Keep this terminal open too!]                  │
└─────────────────────────────────────────────────┘
```

---

## Step 8: Test Login

### Open Browser

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  🌐 http://localhost:3000                       │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │                                            │  │
│  │        🎓 ELMS Login                       │  │
│  │                                            │  │
│  │  📧 Email                                  │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ mahealif221031@bscse.uiu.ac.bd       │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  │                                            │  │
│  │  🔑 Password                               │  │
│  │  ┌──────────────────────────────────────┐ │  │
│  │  │ password123                          │ │  │
│  │  └──────────────────────────────────────┘ │  │
│  │                                            │  │
│  │  [ Login ] ← Click                        │  │
│  │                                            │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### After Login

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  🎓 Student Dashboard - Mahe Alif               │
│                                                  │
│  ┌─────────────────────────────────────┐        │
│  │ 📚 My Courses                        │        │
│  │                                      │        │
│  │  ┌────────────────────────────────┐ │        │
│  │  │ Introduction to Economics       │ │        │
│  │  │ ECON 1101 - Section A          │ │        │
│  │  │ Dr. Sarah Johnson              │ │        │
│  │  │                                │ │        │
│  │  │ 📄 Materials: 2                │ │        │
│  │  │ 📝 Assignments: 1              │ │        │
│  │  │ [ View Course ]                │ │        │
│  │  └────────────────────────────────┘ │        │
│  └─────────────────────────────────────┘        │
│                                                  │
│  Tabs: [ Courses ] [ AI Assistant ] [ Chat ]   │
│                                                  │
│  ✅ Login successful!                           │
└─────────────────────────────────────────────────┘
```

---

## Step 9: Test AI Assistant

### Navigate to AI Tab

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  🤖 AI Learning Assistant                       │
│                                                  │
│  ┌─────────────────────────────────────┐        │
│  │ 📎 Attached Materials (0)            │        │
│  │ No materials attached yet            │        │
│  └─────────────────────────────────────┘        │
│                                                  │
│  ┌─────────────────────────────────────┐        │
│  │ 💬 Chat History                      │        │
│  │                                      │        │
│  │  [No messages yet]                  │        │
│  │                                      │        │
│  └─────────────────────────────────────┘        │
│                                                  │
│  Type your message...                          │
│  ┌──────────────────────────────────┐ [ Send ] │
│  │ Explain supply and demand        │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

### AI Response

```
┌─────────────────────────────────────────────────┐
│  💬 Chat History                                 │
│                                                  │
│  👤 You:                                         │
│  Explain supply and demand                      │
│                                                  │
│  🤖 AI:                                          │
│  Supply and demand are fundamental economic     │
│  principles. Supply represents how much of a    │
│  product sellers are willing to offer at        │
│  different prices. Demand represents how much   │
│  buyers want to purchase at those prices...     │
│                                                  │
│  ✅ AI is working!                              │
└─────────────────────────────────────────────────┘
```

---

## Step 10: Add Material to AI

### View Course Materials

```
┌─────────────────────────────────────────────────┐
│  📚 Economics Course - Materials                 │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 📄 Introduction to Microeconomics          │ │
│  │ PDF • 4.2 MB • Uploaded 2024-10-10        │ │
│  │ [ Download ] [ Add to AI Chat ] ← Click   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 📊 Supply and Demand Analysis              │ │
│  │ PPT • 6.5 MB • Uploaded 2024-10-10        │ │
│  │ [ Download ] [ Add to AI Chat ]           │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Toast Notification

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  [Top-right corner]                             │
│  ┌──────────────────────────────────────┐       │
│  │ ✅ Success                            │       │
│  │ Material added to AI chat             │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  [Disappears after 3 seconds]                   │
└─────────────────────────────────────────────────┘
```

### AI Tab Updated

```
┌─────────────────────────────────────────────────┐
│  🤖 AI Learning Assistant                       │
│                                                  │
│  ┌─────────────────────────────────────┐        │
│  │ 📎 Attached Materials (1)            │        │
│  │                                      │        │
│  │  ┌────────────────────────────────┐ │        │
│  │  │ 📄 Introduction to Micro...     │ │        │
│  │  │ [Economics]                    │ │        │
│  │  └────────────────────────────────┘ │        │
│  └─────────────────────────────────────┘        │
│                                                  │
│  💬 Now ask AI about this material!             │
│                                                  │
│  ✅ Material context loaded!                    │
└─────────────────────────────────────────────────┘
```

---

## ✅ Setup Complete!

### Your System Status

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  ✅ Database Setup Complete                     │
│     └─ 31 users, 8 courses, 60+ enrollments     │
│                                                  │
│  ✅ Backend Running                             │
│     └─ http://localhost:5000                    │
│                                                  │
│  ✅ Frontend Running                            │
│     └─ http://localhost:3000                    │
│                                                  │
│  ✅ Login Tested                                │
│     └─ mahealif221031@bscse.uiu.ac.bd           │
│                                                  │
│  ✅ AI Assistant Working                        │
│     └─ OpenRouter integrated                    │
│                                                  │
│  ✅ Material Context Working                    │
│     └─ Can add materials to AI                  │
│                                                  │
│  🎉 ELMS is fully operational!                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 What You Can Do Now

### As a Student

```
┌──────────────────┬──────────────────┬──────────────────┐
│ 📚 View Courses  │ 📄 Study Materials│ 📝 Assignments   │
├──────────────────┼──────────────────┼──────────────────┤
│ See enrolled     │ Download PDFs    │ View assignments │
│ courses          │ View PPTs        │ Submit work      │
│ Check schedule   │ Access videos    │ Check grades     │
└──────────────────┴──────────────────┴──────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│ 🤖 AI Assistant  │ 💬 Class Chat    │ 📅 Calendar      │
├──────────────────┼──────────────────┼──────────────────┤
│ Ask questions    │ Real-time chat   │ View deadlines   │
│ Get help         │ with classmates  │ Track events     │
│ Add materials    │ Ask teacher      │ Stay organized   │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🔧 Terminal Layout

### Recommended Setup

```
┌─────────────────────────────────────────────────┐
│ 🖥️  Terminal 1 - Backend                        │
│                                                  │
│ C:\...\elms> npm run dev                         │
│ 🚀 Server is running on port 5000               │
│ ✅ Database connected                           │
│ [Keep running...]                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🖥️  Terminal 2 - Frontend                       │
│                                                  │
│ C:\...\elms-uiu> npm run dev                     │
│ ▲ Next.js 15.0.4                                │
│ - Local: http://localhost:3000                  │
│ [Keep running...]                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🌐 Browser                                       │
│                                                  │
│ http://localhost:3000                           │
│ [ELMS Application Running]                      │
└─────────────────────────────────────────────────┘
```

---

## 📊 Progress Tracker

### Completed Steps

- [x] Step 1: Install Prerequisites ✅
- [x] Step 2: Get the Project ✅
- [x] Step 3: Setup Database ✅
- [x] Step 4: Configure Backend ✅
- [x] Step 5: Start Backend ✅
- [x] Step 6: Configure Frontend ✅
- [x] Step 7: Start Frontend ✅
- [x] Step 8: Test Login ✅
- [x] Step 9: Test AI Assistant ✅
- [x] Step 10: Add Material to AI ✅

### Result: 🎉 **ALL DONE!**

---

**Version**: 1.0.0  
**Setup Time**: 15-30 minutes  
**Difficulty**: ⭐⭐ (Beginner-Friendly)
