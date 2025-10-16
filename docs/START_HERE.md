# 🎯 START HERE - ELMS Setup

**Welcome!** You're about to set up the complete ELMS (E-Learning Management System).

---

## ⚡ Super Quick Start (3 Commands)

### Windows
```powershell
.\setup_database.ps1
cd elms && npm install && npm run dev
cd elms-uiu && npm install && npm run dev
```

### macOS/Linux
```bash
chmod +x setup_database.sh && ./setup_database.sh
cd elms && npm install && npm run dev
cd elms-uiu && npm install && npm run dev
```

**Then:** Open http://localhost:3000 and login with:
- Email: `mahealif221031@bscse.uiu.ac.bd`
- Password: `password123`

---

## 📚 Need Help? Pick Your Guide

### I'm New to This
👉 **[VISUAL_SETUP_GUIDE.md](VISUAL_SETUP_GUIDE.md)** - Pictures, step-by-step

### I Know What I'm Doing
👉 **[QUICK_SETUP.md](QUICK_SETUP.md)** - Just the commands

### I'm Moving to a New Computer
👉 **[PROJECT_MIGRATION_CHECKLIST.md](PROJECT_MIGRATION_CHECKLIST.md)** - Full checklist

### I Want to Understand Everything
👉 **[SETUP_PACKAGE_README.md](SETUP_PACKAGE_README.md)** - Complete guide

### I Have Database Questions
👉 **[DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)** - Database details

### I Want to See What's Included
👉 **[DATABASE_CONTENTS.md](DATABASE_CONTENTS.md)** - Data overview

### Show Me All Documentation
👉 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete index

---

## 🔧 What You Need

- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- ✅ Git ([Download](https://git-scm.com))

---

## 🎯 What You'll Get

- 31 users (including your account)
- 8 courses across different subjects
- Real study materials
- AI Learning Assistant (powered by OpenRouter)
- Real-time class chat
- Complete assignment system
- Calendar with events
- And much more!

---

## 🆘 Problems?

### "MySQL not found"
Install MySQL or add it to your PATH

### "Port already in use"
Change PORT in .env file

### "Connection refused"
Check if MySQL is running: `net start MySQL80` (Windows) or `sudo systemctl start mysql` (Linux)

### Everything else
Check **[DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)** - Troubleshooting section

---

## ✨ That's It!

This is all you need to know to get started. Pick a guide above and you'll be running ELMS in 15-30 minutes!

**Questions?** All answers are in the documentation listed above.

---

**Made with ❤️ for education**
