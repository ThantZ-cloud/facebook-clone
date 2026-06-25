const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Comment routes — nested under /api/posts for post-specific comments
router.get('/:postId/comments', protect, getComments);
router.post('/:postId/comments', protect, addComment);

// Standalone delete — mounted separately at /api/comments/:id
const commentRouter = express.Router();
commentRouter.delete('/:id', protect, deleteComment);

module.exports = { postCommentRouter: router, commentRouter };
