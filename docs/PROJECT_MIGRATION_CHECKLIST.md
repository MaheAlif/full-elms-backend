# 📦 ELMS - Project Migration Checklist

Complete checklist for setting up ELMS on a new computer.

## ✅ Prerequisites Checklist

### Required Software
- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- [ ] MySQL 8.0+ installed ([mysql.com](https://dev.mysql.com/downloads/))
- [ ] Git installed ([git-scm.com](https://git-scm.com))
- [ ] VS Code or preferred IDE (optional)

### Verify Installations
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show v9.x.x or higher
mysql --version   # Should show 8.0.x or higher
git --version     # Should show 2.x.x or higher
```

---

## 📥 Step 1: Clone the Project

```bash
# Clone from GitHub
git clone <your-repository-url>
cd elms

# Or copy the entire folder
# Copy the 'elms' folder to your new PC
```

---

## 🗄️ Step 2: Database Setup (Automated)

### Windows (PowerShell)
```powershell
cd elms
.\setup_database.ps1
```

### macOS/Linux (Bash)
```bash
cd elms
chmod +x setup_database.sh
./setup_database.sh
```

### Manual Setup
```bash
mysql -u root -p < setup_complete_database.sql
```

**What this does:**
- ✅ Creates `elms` database
- ✅ Creates all 17 tables
- ✅ Populates with realistic data
- ✅ Sets up 31 users (your account included)
- ✅ Configures courses, materials, assignments
- ✅ Initializes AI and chat systems

---

## 🔧 Step 3: Backend Configuration

```bash
# Navigate to backend root
cd elms

# Install dependencies
npm install

# Create .env file
# Copy the template below or use existing .env
```

### Backend `.env` Template
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=elms
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenRouter AI Configuration
OPENROUTER_API_KEY=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
AI_MODEL=z-ai/glm-4.5-air:free
AI_BASE_URL=https://openrouter.ai/api/v1

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Start Backend
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
✅ Database connected successfully
```

---

## 🎨 Step 4: Frontend Configuration

```bash
# Navigate to frontend
cd elms-uiu

# Install dependencies
npm install
```

### Frontend `.env.local` (Optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.0.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## 🧪 Step 5: Verification

### Test Backend API
```bash
# In a new terminal
curl http://localhost:5000/api/health

# Expected: {"status":"OK"}
```

### Test Frontend
1. Open browser: `http://localhost:3000`
2. Should see ELMS login page

### Test Login
**Your Account:**
- Email: `mahealif221031@bscse.uiu.ac.bd`
- Password: `password123`

**Expected:**
- ✅ Successful login
- ✅ Redirect to student dashboard
- ✅ See Economics course
- ✅ Access to AI Assistant

### Test Other Accounts

**Admin:**
- Email: `admin.aminul@uiu.ac.bd`
- Password: `password123`

**Teacher:**
- Email: `sarah.johnson@uiu.ac.bd`
- Password: `password123`

---

## 📁 Step 6: File Structure Verification

Ensure these files/folders exist:

```
elms/
├── 📄 setup_complete_database.sql ✅ All-in-one DB script
├── 📄 setup_database.ps1          ✅ Windows setup script
├── 📄 setup_database.sh           ✅ macOS/Linux setup script
├── 📄 DATABASE_SETUP_GUIDE.md     ✅ Detailed guide
├── 📄 QUICK_SETUP.md              ✅ Quick reference
├── 📄 DATABASE_CONTENTS.md        ✅ What's in the database
├── 📄 .env                        ✅ Backend config (create this)
├── 📄 package.json                ✅ Backend dependencies
├── 📁 src/                        ✅ Backend source code
├── 📁 sql/                        ✅ Individual SQL scripts
├── 📁 docs/                       ✅ Documentation
└── 📁 elms-uiu/                   ✅ Frontend Next.js app
    ├── 📄 package.json            ✅ Frontend dependencies
    ├── 📄 .env.local              ✅ Frontend config (optional)
    └── 📁 src/                    ✅ Frontend source code
```

---

## 🔍 Troubleshooting

### ❌ "MySQL not found"
**Windows:**
```powershell
# Add to PATH
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### ❌ "Connection refused" (Backend)
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo systemctl start mysql
   ```
2. Verify MySQL credentials in `.env`
3. Test connection: `mysql -u root -p`

### ❌ "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### ❌ "Port 3000 already in use"
Change Next.js port:
```bash
npm run dev -- -p 3001
```

### ❌ "Module not found"
```bash
# Backend
cd elms
rm -rf node_modules package-lock.json
npm install

# Frontend
cd elms-uiu
rm -rf node_modules package-lock.json
npm install
```

### ❌ Database errors
Reset database:
```bash
mysql -u root -p < setup_complete_database.sql
```

---

## 🚀 Quick Commands Reference

### Start Everything
```bash
# Terminal 1 - Backend
cd elms
npm run dev

# Terminal 2 - Frontend
cd elms/elms-uiu
npm run dev
```

### Reset Database
```bash
mysql -u root -p < setup_complete_database.sql
```

### View Logs
```bash
# Backend logs show in Terminal 1
# Frontend logs show in Terminal 2
# MySQL logs: Check MySQL error log location
```

### Stop Services
```bash
# Press Ctrl+C in each terminal
# Or close the terminal windows
```

---

## 📊 Expected System State

After successful setup:

### Database
- ✅ `elms` database exists
- ✅ 17 tables created
- ✅ 31 users (2 admins, 6 teachers, 23 students)
- ✅ 8 courses with 11 sections
- ✅ 60+ enrollments
- ✅ 22 study materials
- ✅ 14 assignments
- ✅ AI context initialized

### Backend (http://localhost:5000)
- ✅ Express server running
- ✅ MySQL connection active
- ✅ JWT authentication working
- ✅ API endpoints responding
- ✅ Socket.IO ready

### Frontend (http://localhost:3000)
- ✅ Next.js dev server running
- ✅ API client configured
- ✅ Login page accessible
- ✅ Student dashboard working
- ✅ AI Assistant functional

---

## 🎯 Feature Testing Checklist

### Student Features (Mahe's Account)
- [ ] Login successful
- [ ] Dashboard shows Economics course
- [ ] View study materials (2 available)
- [ ] View assignment (Economic Analysis)
- [ ] Submit assignment
- [ ] Access AI Learning Assistant
- [ ] Chat with AI
- [ ] Add material to AI context
- [ ] View calendar events
- [ ] Participate in class chat
- [ ] Receive notifications

### Teacher Features (Sarah's Account)
- [ ] Login successful
- [ ] Dashboard shows Economics Section A
- [ ] View enrolled students (5 total)
- [ ] Upload study materials
- [ ] Create assignments
- [ ] View submissions
- [ ] Grade submissions
- [ ] Post announcements
- [ ] View/manage calendar
- [ ] Participate in chat

### Admin Features
- [ ] Login successful
- [ ] View system statistics
- [ ] Manage users (create/edit/delete)
- [ ] Manage courses
- [ ] Manage university events
- [ ] View all enrollments
- [ ] System monitoring

---

## 📝 Important Notes

### Default Passwords
- **All users:** `password123`
- **Change in production!**

### API Keys
- OpenRouter key included in setup
- Free tier: GLM 4.5 Air model
- Monthly limit: Check OpenRouter dashboard

### File Uploads
- Backend handles file storage
- Default location: `uploads/` folder
- Materials: `uploads/materials/`
- Submissions: `uploads/submissions/`

### Database Backups
```bash
# Create backup
mysqldump -u root -p elms > elms_backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p elms < elms_backup_20241016.sql
```

---

## 🎓 Next Steps After Setup

1. **Customize:**
   - Change JWT secret in production
   - Update OpenRouter API key if needed
   - Modify university events
   - Add your own courses/users

2. **Deploy:**
   - Set up production database
   - Configure environment variables
   - Deploy backend (Heroku, Railway, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

3. **Maintain:**
   - Regular database backups
   - Monitor API usage
   - Update dependencies
   - Review security settings

---

## 📞 Support Resources

### Documentation
- `DATABASE_SETUP_GUIDE.md` - Complete database guide
- `QUICK_SETUP.md` - Quick reference card
- `DATABASE_CONTENTS.md` - What's in the database
- `README.md` - Project overview
- `docs/` folder - Additional documentation

### Useful Commands
```bash
# Check MySQL status
mysql -u root -p -e "SHOW DATABASES;"

# Check backend
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000

# View database stats
mysql -u root -p elms -e "
  SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM courses) as courses,
    (SELECT COUNT(*) FROM enrollments) as enrollments,
    (SELECT COUNT(*) FROM assignments) as assignments;
"
```

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] Node.js, MySQL, Git installed
- [ ] Project cloned/copied
- [ ] Database created and populated
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed
- [ ] Backend server running (port 5000)
- [ ] Frontend dependencies installed
- [ ] Frontend server running (port 3000)
- [ ] Login works with test account
- [ ] Can view courses and materials
- [ ] AI Assistant responds
- [ ] No console errors

**If all checked:** 🎉 **Setup Complete!**

---

**Version:** 1.0.0  
**Last Updated:** October 16, 2024  
**Estimated Setup Time:** 15-30 minutes
