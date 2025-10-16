# 💬 Phase 6: Class Chat Implementation Plan

## 📋 **UNDERSTANDING OF THE SYSTEM**

### **Current Database Structure**
✅ **Tables Exist:**
- `chat_rooms` - Links chat rooms to sections (course sections)
- `chat_messages` - Stores all chat messages with sender, room, message, and timestamp
- `sections` - Course sections (e.g., "CSE 4101 - Section A")
- `enrollments` - Maps students to sections
- `users` - All users (students, teachers, admins)
- `courses` - Course information

### **How Chat Should Work (Based on Screenshots)**
From your screenshots, I understand:
1. **Mahe Alif is enrolled in:**
   - `CSE-4101: Advanced React Development` (Section A)
   - `CSE-4201: Machine Learning Fundamentals` (Section A)
   - `Bio-201: Biology` (Section A)

2. **When Mahe selects a course**, they should see:
   - A chat room for THAT specific course section
   - All students enrolled in the SAME section can chat
   - Example: If Mahe clicks "CSE-4101", they see the chat for "CSE 4101 - Section A"
   - Other students in "CSE 4101 - Section B" have a DIFFERENT chat room

3. **Chat Room Logic:**
   - Each **section** has ONE chat room
   - All students enrolled in that section share the same chat
   - Teachers assigned to the course can also see/join the chat

### **Current Backend Status**
✅ **Already Implemented:**
- Socket.IO server running on Express
- Socket.IO connection handling in `src/app.ts`
- Basic socket events: `join-room`, `leave-room`, `chat-message`, `typing-start`, `typing-stop`
- Authentication middleware (JWT)
- Student routes with placeholder chat endpoints

❌ **NOT Implemented:**
- Database operations for chat messages
- Chat room creation/management
- Chat history retrieval
- Persistent message storage
- Course-specific chat routing
- Frontend Socket.IO client connection

---

## 🎯 **IMPLEMENTATION PLAN**

### **Phase 6.1: Backend - Chat Controller & Routes**

#### **Step 1: Create Chat Controller** (`src/controllers/chatController.ts`)
```typescript
Features:
- getCourseChat(courseId) - Get or create chat room for a course section
- getChatHistory(roomId) - Retrieve past messages
- sendMessage(roomId, userId, message) - Save message to database
- getChatParticipants(roomId) - Get all users in a chat room
```

#### **Step 2: Update Student Routes** (`src/routes/student.ts`)
```
GET /api/student/courses/:courseId/chat - Get chat room and history
POST /api/student/courses/:courseId/chat - Send message (with auth)
GET /api/student/courses/:courseId/chat/participants - Get chat members
```

#### **Step 3: Update Socket.IO Handler** (`src/app.ts`)
```typescript
Enhanced features:
- Verify user authentication on socket connection
- Auto-create chat rooms for sections
- Save messages to database on 'chat-message' event
- Broadcast to section-specific rooms only
```

---

### **Phase 6.2: Backend - Chat Service Logic**

#### **Key Queries Needed:**
1. **Get/Create Chat Room for Section:**
   ```sql
   SELECT cr.id, cr.name, s.id as section_id, c.title as course_name
   FROM chat_rooms cr
   JOIN sections s ON cr.section_id = s.id
   JOIN courses c ON s.course_id = c.id
   WHERE s.id = ?
   ```

2. **Get Chat History:**
   ```sql
   SELECT cm.id, cm.message, cm.message_type, cm.file_url, cm.timestamp,
          u.id as sender_id, u.name as sender_name, u.avatar_url
   FROM chat_messages cm
   JOIN users u ON cm.sender_id = u.id
   WHERE cm.room_id = ?
   ORDER BY cm.timestamp ASC
   LIMIT 100
   ```

3. **Save Message:**
   ```sql
   INSERT INTO chat_messages (room_id, sender_id, message, message_type, file_url)
   VALUES (?, ?, ?, ?, ?)
   ```

4. **Get Chat Participants (Students in Section):**
   ```sql
   SELECT u.id, u.name, u.email, u.avatar_url
   FROM enrollments e
   JOIN users u ON e.user_id = u.id
   WHERE e.section_id = ?
   ```

---

### **Phase 6.3: Frontend - Socket.IO Client Setup**

#### **Step 1: Install Socket.IO Client**
```bash
cd elms-uiu
npm install socket.io-client
```

#### **Step 2: Create Socket Context** (`src/lib/socket.ts`)
```typescript
- SocketProvider component
- useSocket() custom hook
- Auto-connect on auth
- Room joining logic
```

#### **Step 3: Update ClassChatPanel Component**
```typescript
Features:
- Connect to Socket.IO
- Join room based on courseId
- Listen for incoming messages
- Send messages via socket
- Display real-time messages
- Typing indicators
- Online user count
```

#### **Step 4: Integrate with Dashboard**
```typescript
- Pass current courseId to ClassChatPanel
- Load chat history on course select
- Real-time message sync
- Notifications for new messages
```

---

### **Phase 6.4: Enhanced Features**

#### **Message Types:**
1. **Text Messages** ✅ (Primary)
2. **Image Sharing** 🔄 (Future)
3. **File Sharing** 🔄 (Future)
4. **Study Materials Links** 🔄 (Future)

#### **Additional Features:**
- Message timestamps
- Read receipts (optional)
- Message editing (optional)
- Message deletion (optional)
- @mentions (optional)
- Emoji reactions (optional)

---

## 📊 **DATABASE SCHEMA (UPDATED)**

### **chat_rooms Table**
```sql
id (PK) | section_id (FK) | name | created_at
1       | 1               | CSE 4101 - Section A Chat | 2025-10-15
2       | 2               | CSE 4101 - Section B Chat | 2025-10-15
3       | 3               | CSE 4201 - Section A Chat | 2025-10-15
10      | 10              | Bio-201 - Section A Chat  | 2025-10-15
```

### **chat_messages Table**
```sql
id | room_id | sender_id | message | message_type | file_url | timestamp
1  | 1       | 32        | "Hi everyone!" | text | NULL | 2025-10-16 10:30:00
2  | 1       | 9         | "Hello Mahe!" | text | NULL | 2025-10-16 10:31:00
```

---

## 🔐 **SECURITY CONSIDERATIONS**

1. **Verify enrollment before allowing chat access**
   - Check if student is enrolled in the section
   - Teachers can access any section they teach

2. **Message validation**
   - Sanitize input to prevent XSS
   - Limit message length
   - Rate limiting for spam prevention

3. **Socket authentication**
   - Verify JWT token on socket connection
   - Disconnect unauthorized users

---

## 🚀 **IMPLEMENTATION ORDER**

### **Step-by-Step:**
1. ✅ Update `database_creation.sql` (DONE)
2. ⏳ Create `chatController.ts`
3. ⏳ Update `student.ts` routes
4. ⏳ Enhance Socket.IO handler in `app.ts`
5. ⏳ Create chat service/helper functions
6. ⏳ Install socket.io-client in frontend
7. ⏳ Create Socket context provider
8. ⏳ Update ClassChatPanel component
9. ⏳ Integrate with student dashboard
10. ⏳ Test with multiple users

---

## 🎯 **SUCCESS CRITERIA**

✅ **Phase 6 Complete When:**
- [ ] Students can see chat for their enrolled courses
- [ ] Messages are saved to database
- [ ] Messages appear in real-time for all users in the same section
- [ ] Chat history loads on page load
- [ ] Only enrolled students can access course chat
- [ ] Multiple sections have separate chat rooms
- [ ] Socket.IO connection is stable
- [ ] No unauthorized access to chats

---

## 📝 **EXAMPLE USER FLOW**

**Scenario: Mahe Alif wants to chat with CSE-4101 classmates**

1. Mahe logs in to student dashboard
2. Mahe clicks on "CSE-4101: Advanced React Development" course card
3. Frontend detects courseId = 1, sectionId = 1
4. Backend checks: Is Mahe enrolled in section 1? ✅ Yes
5. Backend finds/creates chat room for section 1 (room_id = 1)
6. Frontend connects to Socket.IO room "room-1"
7. Backend loads last 100 messages from `chat_messages` where `room_id = 1`
8. Mahe types "Hi everyone!"
9. Frontend emits socket event: `chat-message` with roomId, message, senderId
10. Backend saves message to database
11. Backend broadcasts message to all users in "room-1"
12. All connected students in CSE-4101 Section A see the message instantly
13. Students in CSE-4101 Section B (room-2) do NOT see the message

---

## 🔧 **TESTING PLAN**

### **Test Cases:**
1. ✅ Single user sends message → Message appears
2. ✅ Multiple users in same section → All receive messages
3. ✅ Users in different sections → Messages isolated
4. ✅ Unenrolled student tries to access chat → 403 Forbidden
5. ✅ Chat history loads on page refresh
6. ✅ Socket disconnection/reconnection works
7. ✅ Typing indicators work
8. ✅ Message timestamps display correctly

---

## 📚 **NEXT STEPS**

Ready to implement! Shall I proceed with:
1. Creating the `chatController.ts`?
2. Updating the routes?
3. Setting up the frontend Socket.IO client?

Let me know and I'll start coding! 🚀
