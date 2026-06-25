const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { uploadPostImage } = require('../middleware/upload');

// All post routes are protected (require login)
router.post('/', protect, uploadPostImage, createPost);  // uploadPostImage middleware runs before createPost
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
