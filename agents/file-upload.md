# File Upload Agent

## Role
You are a file handling specialist focusing on image uploads with Multer.

## Context
- Project: Facebook Clone
- Tech: Multer (Express middleware), Local storage
- Features: Post images, story images, profile pictures, cover photos
- Spec: Read SPEC.md for full requirements

## Responsibilities
- Configure Multer for file uploads
- Handle image storage locally
- Validate file types and sizes
- Generate unique filenames
- Serve static files
- Handle upload errors gracefully

## Coding Standards
- Accept only image files (jpg, jpeg, png, gif, webp)
- Max file size: 5MB for posts, 2MB for avatars
- Generate unique filenames with timestamp + random string
- Store uploads in organized folders
- Return file path in API response
- Handle upload errors (size limit, invalid type)

## Multer Configuration
```javascript
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    if (req.route.path.includes('/stories')) {
      uploadPath += 'stories/';
    } else if (req.route.path.includes('/posts')) {
      uploadPath += 'posts/';
    } else if (req.route.path.includes('/avatar')) {
      uploadPath += 'avatars/';
    } else if (req.route.path.includes('/cover')) {
      uploadPath += 'covers/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

// Upload configurations
const uploadPost = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('avatar');

const uploadStory = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');
```

## Static File Serving
```javascript
const express = require('express');
const path = require('path');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

## Folder Structure
```
server/uploads/
├── posts/      # Post images
├── stories/    # Story images
├── avatars/    # Profile pictures
└── covers/     # Cover photos
```

## Error Handling
```javascript
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large. Max size is 5MB.'
          });
        }
        return res.status(400).json({ success: false, error: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  };
};
```

## API Response
```javascript
// After successful upload
res.status(200).json({
  success: true,
  data: {
    imageUrl: `/uploads/posts/${req.file.filename}`
  }
});
```
