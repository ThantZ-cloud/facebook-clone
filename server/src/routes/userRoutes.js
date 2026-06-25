const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadCoverPhoto,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: uploadAvatarMiddleware, uploadCover } = require('../middleware/upload');

// Search users — GET /api/users/search?q=
router.get('/search', protect, searchUsers);

// Get user profile — GET /api/users/:id
router.get('/:id', protect, getUserProfile);

// Update own profile (name, bio) — PUT /api/users/me
router.put('/me', protect, updateProfile);

// Upload avatar — POST /api/users/me/avatar
router.post('/me/avatar', protect, uploadAvatarMiddleware, uploadAvatar);

// Upload cover photo — POST /api/users/me/cover
router.post('/me/cover', protect, uploadCover, uploadCoverPhoto);

module.exports = router;
