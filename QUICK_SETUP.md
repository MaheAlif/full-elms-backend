# 🚀 ELMS - Quick Setup Reference

## One-Command Database Setup

### Windows
```powershell
.\setup_database.ps1
```

### macOS/Linux
```bash
chmod +x setup_database.sh && ./setup_database.sh
```

### Manual
```bash
mysql -u root -p < setup_complete_database.sql
```

---

## What You Get

✅ **Complete database** with 17 tables  
✅ **31 users** (2 admins, 6 teachers, 23 students)  
✅ **8 courses** across different subjects  
✅ **11 sections** with enrollments  
✅ **14 assignments** with submissions  
✅ **22 study materials**  
✅ **AI integration** ready  
✅ **Real-time chat** setup  

---

## Default Login

**Your Account:**
- 📧 `mahealif221031@bscse.uiu.ac.bd`
- 🔑 `password123`

**All users have password:** `password123`

---

## Start Development

```bash
# Terminal 1 - Backend
cd elms
npm install
npm run dev

# Terminal 2 - Frontend
cd elms/elms-uiu
npm install
npm run dev
```

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:3000

---

## Environment Variables

Create `.env` in root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=elms
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=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
```

---

## Troubleshooting

**MySQL not found?**
- Windows: Add MySQL bin folder to PATH
- macOS: `brew install mysql`
- Linux: `sudo apt-get install mysql-server`

**Connection refused?**
```bash
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl start mysql
```

**Reset database?**
- Just run the setup script again!

---

## Features Ready to Use

🎓 **Student Portal**
- View enrolled courses
- Access study materials
- Submit assignments
- AI Learning Assistant
- Class chat

👨‍🏫 **Teacher Dashboard**
- Manage sections
- Upload materials
- Grade assignments
- Track student progress
- Calendar events

🔧 **Admin Panel**
- User management
- Course creation
- System statistics
- University events

---

## Need Help?

📖 Full guide: `DATABASE_SETUP_GUIDE.md`  
🗂️ All-in-one script: `setup_complete_database.sql`  
📁 Individual migrations: `sql/` folder  
📝 Documentation: `docs/` folder

---

**Version:** 1.0.0  
**Updated:** October 16, 2024
