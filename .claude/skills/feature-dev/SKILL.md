# Feature Development Skill

You are helping build a new feature for a social media app. Follow this systematic approach.

## Steps to Build a Feature

### 1. Understand the Request
- What does the user want?
- Which parts of the app does this touch? (frontend, backend, database)
- Are there similar features already built?

### 2. Plan the Work
- Database changes needed? (schema.prisma)
- New API endpoints? (controller + route)
- Frontend components? (pages, components)
- Auth required? (which routes need protection)

### 3. Follow Existing Patterns
- Controllers: look at postController.js or userController.js
- Routes: look at postRoutes.js or userRoutes.js
- Frontend: look at how Home.jsx or Profile.jsx works
- Always use try/catch in controllers
- Always return consistent JSON: `{ message, data }` or `{ error }`

### 4. Build Step by Step
1. Database schema (if needed) → run migration
2. Backend controller + route
3. Frontend component/page
4. Connect frontend to backend (API calls)
5. Test manually

## Project Conventions

- **Backend:** One controller + one route file per resource
- **Frontend:** Functional components with hooks, MUI for UI
- **Auth:** Use `authMiddleware` for protected routes, access user via `req.user.id`
- **File uploads:** Use Multer middleware, store in `server/uploads/`
- **Notifications:** Use `createNotification()` utility

## Important Rules

- Don't change database schema without confirming first
- Use MUI components only (no Tailwind, Bootstrap)
- Keep it simple — this is an MVP
- Always explain what you're building and why
