# 🤖 Sub-Agents Guide

## Overview

These agents are specialized assistants for different parts of the Facebook Clone project. Use them to work in parallel and speed up development.

---

## Available Agents

### 1. **Backend API Agent** (`agents/backend-api.md`)
**Use for:** Express routes, controllers, CRUD operations, error handling

**Best for:**
- Creating new API endpoints
- Implementing controller logic
- Writing middleware
- Handling request/response formatting

---

### 2. **Database & Prisma Agent** (`agents/database-prisma.md`)
**Use for:** Schema design, migrations, queries, seed data

**Best for:**
- Writing Prisma schemas
- Creating migrations
- Writing complex queries
- Seeding the database
- Optimizing database performance

---

### 3. **Frontend React Agent** (`agents/frontend-react.md`)
**Use for:** React components, MUI styling, forms, state management

**Best for:**
- Building UI components
- Implementing MUI layouts
- Handling forms and validation
- Making API calls
- Managing component state

---

### 4. **Auth & Security Agent** (`agents/auth-security.md`)
**Use for:** JWT, bcrypt, authentication middleware, authorization

**Best for:**
- User registration/login
- Password hashing
- JWT token generation/verification
- Protected routes
- Permission checks

---

### 5. **Real-time Socket Agent** (`agents/realtime-socket.md`)
**Use for:** Socket.io setup, real-time messaging, typing indicators

**Best for:**
- Socket.io server setup
- Real-time message delivery
- Typing indicators
- Online user tracking
- Event handling

---

### 6. **File Upload Agent** (`agents/file-upload.md`)
**Use for:** Multer configuration, image uploads, static file serving

**Best for:**
- Setting up Multer
- Handling file uploads
- Image validation
- Organizing upload folders
- Serving static files

---

### 7. **Testing & Debug Agent** (`agents/testing-debug.md`)
**Use for:** Writing tests, debugging issues, ensuring code quality

**Best for:**
- Unit tests
- Integration tests
- Debugging errors
- Edge case validation
- Test coverage

---

## 🚀 Parallel Workflows

### Example 1: Starting a New Feature (Posts)

**Run in parallel:**
1. **Database Agent** → Create Post model in schema
2. **Backend Agent** → Create post routes and controllers
3. **Frontend Agent** → Create PostCard component
4. **File Upload Agent** → Setup image upload for posts

---

### Example 2: Authentication System

**Run in sequence:**
1. **Database Agent** → Ensure User model is ready
2. **Auth Agent** → Implement register/login logic
3. **Backend Agent** → Create auth routes
4. **Frontend Agent** → Build Login/Register pages
5. **Testing Agent** → Write auth tests

---

### Example 3: Messaging Feature

**Run in parallel:**
1. **Database Agent** → Create Conversation and Message models
2. **Backend Agent** → Create message API endpoints
3. **Socket Agent** → Setup real-time messaging events
4. **Frontend Agent** → Build ChatWindow component

---

## 📋 How to Use Agents

### Step 1: Tell Claude Which Agent
```
"Use the Backend API Agent to create the post controller"
```

### Step 2: Provide Context
```
"Using the Database Agent, add a Comment model to the Prisma schema with relations to User and Post"
```

### Step 3: Run Parallel Tasks
```
"I want to work on the posts feature. Use:
1. Database Agent - create Post model
2. Backend Agent - create post routes
3. Frontend Agent - create PostCard component"
```

---

## 💡 Pro Tips

1. **Start with Database** → Schema changes affect everything
2. **Backend before Frontend** → Know your API shape first
3. **Auth early** → Other features depend on user context
4. **Test as you go** → Don't save testing for the end
5. **Use File Upload Agent** → Image handling is tricky, get it right

---

## 🎯 Quick Reference by Feature

| Feature | Agents Needed |
|---------|---------------|
| Auth (Register/Login) | Database → Auth → Backend → Frontend |
| Posts | Database → File Upload → Backend → Frontend |
| Comments | Database → Backend → Frontend |
| Likes | Database → Backend → Frontend |
| Stories | Database → File Upload → Backend → Frontend |
| Friends | Database → Backend → Frontend |
| Messaging | Database → Backend → Socket → Frontend |
| User Profile | Database → File Upload → Backend → Frontend |

---

## 📁 Agent Files Location

```
agents/
├── backend-api.md
├── database-prisma.md
├── frontend-react.md
├── auth-security.md
├── realtime-socket.md
├── file-upload.md
└── testing-debug.md
```

---

Ready to start coding? Begin with **Phase 1: Setup & Auth**! 🚀
