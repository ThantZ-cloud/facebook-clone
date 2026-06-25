const express = require('express');
const router = express.Router();
const { toggleLike, getLikes } = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

// Like routes — nested under /api/posts
router.post('/:postId/like', protect, toggleLike);
router.get('/:postId/likes', protect, getLikes);

module.exports = router;
