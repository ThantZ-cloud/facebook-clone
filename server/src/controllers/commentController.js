const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Fetch comments with user info, ordered oldest first (chronological)
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching comments'
    });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const { content } = req.body;

    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: req.user.id,
        postId: postId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding comment'
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (owner only)
const deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Only the owner can delete their comment
    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({
      success: true,
      data: { message: 'Comment deleted' }
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting comment'
    });
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
