# GaDone's Hut

A full-stack social media app built with React, Express, Prisma, and Socket.io.

## 🚀 Features

- **Authentication** — Register/Login with JWT
- **Posts** — Create, view, like posts with images
- **Comments** — Comment on posts
- **Friends** — Send/accept friend requests, manage friend list
- **Notifications** — Real-time alerts for friend requests, likes, comments
- **Profiles** — User profiles with avatars, bio, cover photo
- **News Feed** — GNews API integration for tech/AI/Myanmar news (coming soon)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Material UI (MUI) |
| Backend | Express.js |
| Database | SQLite + Prisma ORM |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |

## 📁 Project Structure

```
├── .claude/                # Claude Code configuration
│   ├── agents/             # Subagent definitions
│   └── skills/             # Skill templates
│
├── client/                 # React frontend
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── context/        # React Context
│       ├── hooks/          # Custom hooks
│       └── services/       # API calls
│
├── server/                 # Express backend
│   ├── prisma/             # Database schema
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── routes/         # API routes
│       ├── middleware/      # Auth, uploads
│       ├── utils/          # Helpers
│       └── socket/         # Socket.io (Phase 5)
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/facebook-clone.git
cd facebook-clone

# Install backend dependencies
cd server
npm install
npx prisma migrate dev
cd ..

# Install frontend dependencies
cd client
npm install
cd ..
```

### Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open http://localhost:5173

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get feed |
| POST | `/api/posts` | Create post |
| DELETE | `/api/posts/:id` | Delete post |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:id/comments` | Get comments |
| POST | `/api/posts/:id/comments` | Add comment |

### Friends
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/friends/request/:id` | Send request |
| PUT | `/api/friends/request/:id` | Accept/reject |
| GET | `/api/friends` | Get friends |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get inbox |
| POST | `/api/conversations/:id/messages` | Send message |

## 🎨 Color Palette

| Color | Hex |
|-------|-----|
| Facebook Blue | `#1877F2` |
| Background | `#F0F2F5` |
| Success Green | `#42B72A` |
| Error Red | `#FA383E` |

## 📝 Environment Variables

### server/.env
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for learning purposes.

---

Built with ❤️ by Thant Zin Htun
