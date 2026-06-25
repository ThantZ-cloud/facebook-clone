# GaDone's Hut — Project Specification

## Overview

A social media app with core features including news feed, user profiles, posts, comments, stories, friend system, and direct messaging.

**Version:** 1.0 (MVP)
**Date:** 2026-06-24

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Material UI (MUI) |
| Backend | Express.js |
| ORM | Prisma |
| Database | SQLite (local file, no server needed) |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| Real-time | Socket.io |
| File Upload | Multer |
| File Storage | Local Storage |
| Deployment | Vercel (frontend) + Railway/Render (backend + DB) |

---

## Features

### 1. Authentication
- User registration with email, password, name
- User login with JWT token
- Password hashing with bcrypt
- Protected routes with JWT middleware

### 2. User Profile
- Profile picture upload
- Cover photo upload
- Bio/description
- Edit profile information
- View other users' profiles

### 3. Posts (News Feed)
- Create posts with text content
- Upload images with posts (no video in v1)
- View chronological news feed (friends' posts only)
- Delete own posts
- Like/unlike posts

### 4. Comments
- Add comments to posts
- View comments on posts
- Delete own comments

### 5. Stories
- Upload image stories
- Stories auto-expire after 24 hours
- View friends' active stories
- Story bar at top of news feed

### 6. Friend System
- Send friend requests
- Accept/reject friend requests
- View friends list
- News feed shows only friends' posts

### 7. Direct Messaging (Text Only)
- Send text messages to friends
- Real-time messaging with Socket.io
- Chat popup UI (Messenger-style, bottom-right)
- Conversations inbox page
- Typing indicators
- Unread message count
- Read receipts (optional)

---

## Database Schema (Prisma)

### User
```prisma
model User {
  id             Int           @id @default(autoincrement())
  email          String        @unique
  password       String
  name           String
  avatar         String?
  coverPhoto     String?
  bio            String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  posts          Post[]
  comments       Comment[]
  likes          Like[]
  stories        Story[]
  sentRequests   FriendRequest[] @relation("sentRequests")
  receivedRequests FriendRequest[] @relation("receivedRequests")
  friends        Friendship[]    @relation("userA")
  friendsOf      Friendship[]    @relation("userB")
  conversationA  Conversation[]  @relation("conversationA")
  conversationB  Conversation[]  @relation("conversationB")
  sentMessages   Message[]       @relation("sentMessages")
}
```

### Post
```prisma
model Post {
  id        Int       @id @default(autoincrement())
  content   String?
  image     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  comments  Comment[]
  likes     Like[]
}
```

### Comment
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())

  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
}
```

### Like
```prisma
model Like {
  id     Int @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id])
  postId Int
  post   Post @relation(fields: [postId], references: [id])

  @@unique([userId, postId])
}
```

### Story
```prisma
model Story {
  id        Int      @id @default(autoincrement())
  image     String
  createdAt DateTime @default(now())
  expiresAt DateTime

  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

### FriendRequest
```prisma
model FriendRequest {
  id         Int      @id @default(autoincrement())
  status     String   @default("PENDING") // PENDING, ACCEPTED, REJECTED
  createdAt  DateTime @default(now())

  senderId   Int
  sender     User     @relation("sentRequests", fields: [senderId], references: [id])
  receiverId Int
  receiver   User     @relation("receivedRequests", fields: [receiverId], references: [id])

  @@unique([senderId, receiverId])
}
```

### Friendship
```prisma
model Friendship {
  id      Int @id @default(autoincrement())
  userAId Int
  userA   User @relation("userA", fields: [userAId], references: [id])
  userBId Int
  userB   User @relation("userB", fields: [userBId], references: [id])

  @@unique([userAId, userBId])
}
```

### Conversation
```prisma
model Conversation {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  userAId   Int
  userA     User      @relation("conversationA", fields: [userAId], references: [id])
  userBId   Int
  userB     User      @relation("conversationB", fields: [userBId], references: [id])

  messages  Message[]

  @@unique([userAId, userBId])
}
```

### Message
```prisma
model Message {
  id             Int          @id @default(autoincrement())
  content        String
  createdAt      DateTime     @default(now())
  isRead         Boolean      @default(false)

  senderId       Int
  sender         User         @relation("sentMessages", fields: [senderId], references: [id])
  conversationId Int
  conversation   Conversation @relation(fields: [conversationId], references: [id])
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get news feed (friends' posts) |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/:id` | Get single post |
| DELETE | `/api/posts/:id` | Delete post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:id/comments` | Get comments for post |
| POST | `/api/posts/:id/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

### Likes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:id/like` | Like/unlike post |
| GET | `/api/posts/:id/likes` | Get likes for post |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get active stories (from friends) |
| POST | `/api/stories` | Create story |
| DELETE | `/api/stories/:id` | Delete story |

### Friends
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/friends/request/:id` | Send friend request |
| PUT | `/api/friends/request/:id` | Accept/reject request |
| GET | `/api/friends` | Get friends list |
| GET | `/api/friends/requests` | Get pending requests |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |
| GET | `/api/users/search?q=` | Search users |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get all user's conversations (inbox) |
| POST | `/api/conversations/:friendId` | Start/get conversation with a friend |
| GET | `/api/conversations/:id/messages` | Get messages in a conversation |
| POST | `/api/conversations/:id/messages` | Send a message |
| PUT | `/api/messages/:id/read` | Mark message as read |

---

## Socket.io Events

### Client → Server
```javascript
socket.emit("message:send", { conversationId, content })
socket.emit("message:typing", { conversationId })
socket.emit("message:read", { conversationId })
```

### Server → Client
```javascript
socket.on("message:new", (message) => { /* display new message */ })
socket.on("message:typing", ({ userId, conversationId }) => { /* show typing indicator */ })
```

---

## Folder Structure

```
facebook-clone/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── StoryBar.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── FriendRequest.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── ConversationList.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Messages.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── postController.js
│   │   │   ├── commentController.js
│   │   │   ├── storyController.js
│   │   │   ├── friendController.js
│   │   │   └── messageController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── storyRoutes.js
│   │   │   ├── friendRoutes.js
│   │   │   └── messageRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   └── index.js
│   ├── uploads/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Development Phases

### Phase 1: Setup & Auth (Week 1) ✅
- [x] Initialize monorepo
- [x] Setup React + MUI
- [x] Setup Express + Prisma
- [x] Database schema + migrations
- [x] Register/Login with JWT

### Phase 2: Core Features (Week 2-3) ✅
- [x] Create/display posts
- [x] Image upload
- [x] Comments system
- [x] Like functionality

### Phase 3: Social Features (Week 3-4) ✅
- [x] Friend request system (send, accept, reject)
- [x] Friends list with search
- [x] Profile page with cover photo, avatar, bio
- [x] Edit profile modal
- [x] 3-column Facebook-style layout
- [x] Custom MUI theme

### Phase 4: Notifications ✅
- [x] Notification model (type, actor, recipient, reference)
- [x] `createNotification()` utility
- [x] Trigger on friend requests, likes, comments
- [x] Polling-based updates (30-second interval)
- [x] Notification dropdown in navbar
- [x] Mark as read / Mark all as read

### Phase 4.5: News Feed (Paused)
- [ ] GNews API integration (backend done)
- [ ] News sidebar in left column (frontend done)
- [ ] Full news viewer with images/video

### Phase 5: Messaging (Week 5-6)
- [ ] Conversation model + API
- [ ] Send/receive messages
- [ ] Socket.io real-time messaging
- [ ] Chat popup UI (Messenger-style)
- [ ] Typing indicator
- [ ] Read receipts (optional)
- [ ] Unread message count

### Phase 6: Polish & Deploy (Week 6-7)
- [ ] Real-time notifications
- [ ] UI polish with MUI
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Setup MySQL on cloud

---

## Constraints & Limitations (v1)

- **No video uploads** — only text and images
- **Text-only messaging** — no media in chat
- **No group chats** — 1-on-1 conversations only
- **No real-time notifications** — polling or manual refresh for non-message events
- **Local file storage** — images stored on server filesystem

---

## Future Enhancements (v2+)

- Video uploads and playback
- Group chats
- Media sharing in messages
- Real-time notifications
- Post sharing/reposting
- User blocking
- Search messages
- Emoji reactions on messages
