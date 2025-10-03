# 🧪 ELMS Backend Testing Suite

This folder contains all testing and debugging scripts for the ELMS Backend API.

## 📁 Available Test Scripts

### 🔧 **Core API Tests**

#### `test-connection.js`
**Purpose**: Basic server connectivity and health check
**Usage**: 
```bash
cd tests
node test-connection.js
```
**Tests**: Server connectivity, health endpoint, basic admin login and stats

#### `test-admin-comprehensive.js` ⭐ **Recommended**
**Purpose**: Comprehensive Admin API testing suite
**Usage**:
```bash
cd tests
node test-admin-comprehensive.js
```
**Tests**:
- Admin authentication
- System statistics
- Course management (GET)
- Teacher management  
- User management with filtering
- **Success Rate Tracking**

#### `test-admin-api.js`
**Purpose**: Detailed Admin API testing with full responses
**Usage**:
```bash
cd tests
node test-admin-api.js
```
**Tests**: Admin login, stats, courses, teachers, course creation

#### `test-auth.js`
**Purpose**: Authentication system comprehensive testing
**Usage**:
```bash
cd tests
node test-auth.js
```
**Tests**: Registration, login, session validation, logout

---

### 🔍 **Debug & Troubleshooting Scripts**

#### `debug-login.js`
**Purpose**: Diagnose login issues and password problems
**Usage**:
```bash
cd tests
node debug-login.js
```
**Features**: Tests specific user credentials, attempts new user registration

#### `verify-user.js`
**Purpose**: Check if test users exist in database
**Usage**:
```bash
cd tests
node verify-user.js
```
**Features**: Verifies test user existence, creates debug users

---

### 🔨 **Database Utility Scripts**

#### `fix-db-passwords.js`
**Purpose**: Fix password hashes in database for test users
**Usage**:
```bash
cd tests
node fix-db-passwords.js
```
**Fixes**: Updates password hashes to match 'password123'
**⚠️ Note**: Requires direct database access

#### `fix-passwords.js`
**Purpose**: Generate correct password hashes for manual database updates
**Usage**:
```bash
cd tests
node fix-passwords.js
```
**Output**: Provides SQL commands to update user passwords

---

### 🖥️ **Simple Tests**

#### `test-api.js`
**Purpose**: Basic curl-based API health check
**Usage**:
```bash
cd tests
node test-api.js
```
**Tests**: Simple health endpoint with curl

---

## 🚀 **Quick Start Testing**

### 1. **Basic Server Check**
```bash
cd tests
node test-connection.js
```

### 2. **Full Admin API Test** (Recommended)
```bash
cd tests
node test-admin-comprehensive.js
```

### 3. **Authentication Test**
```bash
cd tests
node test-auth.js
```

---

## 📊 **Current Test Status**

### ✅ **Working APIs (100% Success Rate)**
- ✅ Admin Authentication (`POST /api/auth/login`)
- ✅ System Statistics (`GET /api/admin/stats`)  
- ✅ Get All Courses (`GET /api/admin/courses`)
- ✅ Get All Teachers (`GET /api/admin/teachers`)
- ✅ Get All Users (`GET /api/admin/users`)

### 🔧 **Partially Working**
- ⚠️ Course Creation (`POST /api/admin/courses`) - Schema mismatch

### 🔑 **Test Credentials**

#### Admin User
```json
{
  "email": "admin.aminul@uiu.ac.bd",
  "password": "password123",
  "role": "admin"
}
```

#### Student User  
```json
{
  "email": "sakib221131@bscse.uiu.ac.bd",
  "password": "password123",
  "role": "student"
}
```

#### Teacher User
```json
{
  "email": "sarah.johnson@uiu.ac.bd", 
  "password": "password123",
  "role": "teacher"
}
```

---

## 🛠️ **Troubleshooting**

### **Server Connection Issues**
1. Ensure backend server is running on port 5000
2. Check if both frontend (3000) and backend (5000) are running
3. Run `node test-connection.js` for basic connectivity test

### **Authentication Issues**
1. Run `node debug-login.js` to diagnose login problems
2. Use `node fix-db-passwords.js` if password hashes are incorrect
3. Check `node verify-user.js` to confirm user existence

### **Database Issues**
1. Ensure MySQL is running (XAMPP)
2. Verify database 'elms' exists and has data
3. Run password fix scripts if needed

---

## 📈 **Test Results Summary**

**Latest Test Results** (October 3, 2025):
- **Total Tests**: 4 core admin APIs
- **✅ Passed**: 4/4 (100% success rate)  
- **❌ Failed**: 0/4
- **Database**: Fully operational with 30 users, 6 courses, 18 materials

**Performance**:
- Average response time: <200ms
- Database queries: Optimized with proper indexing
- Authentication: JWT token-based, secure

---

## 🎯 **Future Test Additions**

When implementing new phases, add tests to this folder:

- **Phase 4**: Teacher Dashboard API tests
- **Phase 5**: Student API tests  
- **Phase 6**: Chat & WebSocket tests
- **Phase 7**: AI Integration tests

---

*Last Updated: October 3, 2025*
*Test Suite Version: 1.0*
*Backend Phase: 3 Complete ✅*