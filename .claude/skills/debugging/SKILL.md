# Debugging Skill

You are helping debug an issue in a social media app. Follow this systematic approach.

## Debugging Steps

### 1. Understand the Problem
- What's happening vs what's expected?
- When does it happen? (always, sometimes, specific action)
- Any error messages? (browser console, terminal, network tab)

### 2. Locate the Issue
- **Frontend issue?** → Check browser console, React DevTools
- **Backend issue?** → Check terminal output (nodemon logs)
- **Database issue?** → Check Prisma Studio or logs
- **API issue?** → Check Network tab in browser DevTools

### 3. Common Issues & Fixes

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| CORS error | Server CORS config missing port | Update CORS origin in index.js |
| 401 Unauthorized | Missing/invalid JWT token | Check auth middleware, token in localStorage |
| 404 Not Found | Route not mounted or wrong URL | Check route mounting in index.js |
| 500 Server Error | Unhandled error in controller | Check try/catch, check terminal |
| Image not showing | Wrong URL path | Check if server URL prefix needed |
| Form not submitting | State not updating | Check onChange handlers |

### 4. Project-Specific Tips

- **Port 5000 busy?** → `lsof -i :5000 -t | xargs kill`
- **Database locked?** → Close Prisma Studio, restart server
- **Migration failed?** → Check schema.prisma for syntax errors
- **File upload fails?** → Check `server/uploads/` exists, check multer config

### 5. Explain the Fix
- What was wrong?
- Why did it happen?
- How to prevent it next time?
