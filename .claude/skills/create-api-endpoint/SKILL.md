# Create API Endpoint

## Purpose
Quickly create a complete API endpoint with route, controller, and validation.

## When to Use
- Adding a new API endpoint
- Creating CRUD operations for a resource

## Steps

### 1. Gather Requirements
Ask user:
- Resource name (e.g., posts, comments, users)
- HTTP methods needed (GET, POST, PUT, DELETE)
- Required fields for request body
- Authentication required? (yes/no)

### 2. Create Controller
```javascript
// server/src/controllers/{resource}Controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all
const getAll = async (req, res) => {
  try {
    const items = await prisma.{resource}.findMany({
      include: { user: true } // adjust relations
    });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST create
const create = async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    const item = await prisma.{resource}.create({
      data: { field1, field2, userId: req.user.id }
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { getAll, create };
```

### 3. Create Routes
```javascript
// server/src/routes/{resource}Routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAll, create } = require('../controllers/{resource}Controller');

router.get('/', protect, getAll);
router.post('/', protect, create);

module.exports = router;
```

### 4. Register Route in index.js
```javascript
const {resource}Routes = require('./routes/{resource}Routes');
app.use('/api/{resources}', {resource}Routes);
```

## Output
- Controller file with CRUD operations
- Routes file with proper middleware
- Registration in main index.js
