const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Helper to create storage for a specific folder
// This avoids repeating the same config for posts, avatars, covers
const createStorage = (folder) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../../uploads/${folder}`));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  }
});

// File filter — only allow image files
const imageFilter = function (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
  }
};

// Post image upload — saves to uploads/posts/
const uploadPostImage = multer({
  storage: createStorage('posts'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
}).single('image');

// Avatar upload — saves to uploads/avatars/
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }  // 2MB (avatars are smaller)
}).single('avatar');

// Cover photo upload — saves to uploads/covers/
const uploadCover = multer({
  storage: createStorage('covers'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
}).single('cover');

module.exports = { uploadPostImage, uploadAvatar, uploadCover };
