const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure disk storage for post images
const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to server/uploads/posts/
    cb(null, path.join(__dirname, '../../uploads/posts'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename: uuid + original extension
    // Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  }
});

// File filter — only allow image files
const imageFilter = function (req, file, cb) {
  // Check mimetype starts with "image/"
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
  }
};

// Create multer instance for post images
const uploadPostImage = multer({
  storage: postStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
}).single('image'); // Expects a single file with field name "image"

module.exports = { uploadPostImage };
