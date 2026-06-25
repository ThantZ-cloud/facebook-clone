# Facebook Clone — Project Instructions for Claude

## Project Overview

A full-stack Facebook clone built as a learning project. The goal is to understand how real-world social media apps work — React on the frontend, Express + Prisma on the backend, SQLite for the database.

**Status:** Phase 1 (Auth) and Phase 2 (Posts, Comments, Likes) are complete. Next up is Phase 3 (Friends system).

## Tech Stack

| Layer | Technology | Port |
|-------|------------|------|
| Frontend | React + MUI + Vite | 5173 |
| Backend | Express.js | 5000 |
| Database | SQLite (Prisma ORM) | — |
| Auth | JWT + bcrypt | — |
| Real-time | Socket.io | (not yet implemented) |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, PostCard, etc.)
│       ├── pages/          # Page-level components (Home, Login, Register)
│       ├── context/        # React Context (AuthContext)
│       └── services/       # API calls (api.js)
│
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (source of truth for models)
│   │   └── seed.js         # Seed data
│   └── src/
│       ├── controllers/    # Business logic (one per resource)
│       ├── routes/         # Express routes (one per resource)
│       ├── middleware/      # auth.js (JWT verify), upload.js (Multer)
│       └── socket/         # Socket.io handlers (Phase 5)
│
└── SPEC.md                 # Full project specification
```

## Coding Conventions

### Frontend (React)
- Use **functional components** with hooks (no class components)
- Use **Material UI (MUI)** for all UI components — don't mix in other UI libraries
- Use **React Context** (`AuthContext`) for global state (auth user, token)
- API calls go through `services/api.js` using **Axios**
- Use `useNavigate` and `useParams` from React Router for navigation

### Backend (Express)
- **Controllers** handle business logic, **routes** handle HTTP mapping
- Always use `authMiddleware` to protect routes that require login
- Access the logged-in user via `req.user.id` (set by auth middleware)
- Return consistent JSON: `{ message, data }` or `{ error }` on failure
- Use `try/catch` in every controller — never let unhandled errors crash the server

### Database (Prisma)
- The **Prisma schema** (`server/prisma/schema.prisma`) is the source of truth
- After changing the schema, run: `npx prisma migrate dev --name <description>`
- Use `prisma.modelName` (e.g., `prisma.user`, `prisma.post`) for queries
- Keep seed data in `server/prisma/seed.js`

### File Uploads (Multer)
- Images are stored in `server/uploads/`
- Use `upload.single('image')` middleware for single file uploads
- Serve static files via `express.static('uploads')`

## Common Commands

```bash
# Backend
cd server
npm run dev                    # Start backend with nodemon
npx prisma migrate dev         # Run database migrations
npx prisma studio              # Open Prisma Studio (visual DB viewer)
npx prisma db seed             # Seed the database

# Frontend
cd client
npm run dev                    # Start Vite dev server
```

## Environment Variables

Backend (`server/.env`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

## Rules for Claude

1. **Always explain what you're doing and why** — this is a learning project
2. **Don't change the database schema** without confirming first — migrations need to be intentional
3. **Follow existing patterns** — look at how auth/posts/comments are structured before adding new features
4. **Use MUI components** — don't introduce Tailwind, Bootstrap, or other CSS frameworks
5. **Keep it simple** — this is an MVP, not production code. Avoid over-engineering
6. **One controller + one route file per resource** — maintain the existing pattern
7. **Test manually** — there are no automated tests yet. Verify by running the app
