# 🎯 Skills Guide

## Overview

Skills are quick-action guides for common development tasks. Use them to speed up repetitive work.

---

## Available Skills

### Development Skills

| Skill | When to Use | Command |
|-------|-------------|---------|
| **Create API Endpoint** | Adding new routes | "Create API endpoint for..." |
| **Create React Component** | Building UI | "Create component for..." |
| **Create Prisma Model** | Adding database tables | "Add Prisma model for..." |
| **Create Page & Route** | Adding new pages | "Create page for..." |

### Support Skills

| Skill | When to Use | Command |
|-------|-------------|---------|
| **Debug Error** | Fixing issues | "Debug this error..." |
| **Run Project** | Starting development | "How to run the project" |
| **Deploy Project** | Going live | "Deploy the project" |

---

## How to Use Skills

### Single Task
```
"Use the Create API Endpoint skill to add comments CRUD"
```

### With Details
```
"Create a React component for the post card using MUI Paper, Avatar, and Typography"
```

### Debugging
```
"Debug this error: Cannot read property 'name' of undefined"
```

---

## Skill → Agent Mapping

Some skills work best with specific agents:

| Skill | Best Agent |
|-------|------------|
| Create API Endpoint | Backend API Agent |
| Create React Component | Frontend React Agent |
| Create Prisma Model | Database & Prisma Agent |
| Create Page & Route | Frontend React Agent |
| Debug Error | Testing & Debug Agent |

---

## Quick Reference

### Starting a Feature
1. **Database first** → "Create Prisma model for..."
2. **API second** → "Create API endpoint for..."
3. **UI third** → "Create React component for..."

### Common Patterns

**Adding a new resource (e.g., Likes):**
```
1. "Create Prisma model for Like with userId and postId"
2. "Create API endpoint for like/unlike post"
3. "Create React component for like button"
```

**Adding a new page:**
```
1. "Create page and route for user settings"
2. "Create React component for settings form"
```

**Fixing a bug:**
```
"Debug error: 401 Unauthorized when creating post"
```

---

## File Locations

```
skills/
├── create-api-endpoint.md
├── create-react-component.md
├── create-prisma-model.md
├── create-page-route.md
├── debug-error.md
├── run-project.md
└── deploy-project.md
```

---

## Tips

1. **Be specific** → "Create API endpoint for comments with GET, POST, DELETE"
2. **Provide context** → "Create PostCard component that shows image, text, likes count"
3. **Chain skills** → Use multiple skills in sequence for complex features
4. **Reference agents** → "Use Backend Agent with Create API Endpoint skill"

---

Ready to start? Try:

```
"Use Create Prisma model skill to add the User model"
```
