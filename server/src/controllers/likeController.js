const { PrismaClient } = require('@prisma/client');
const { createNotification } = require('../utils/createNotification');

const prisma = new PrismaClient();

// @desc    Toggle like on a post (like if not liked, unlike if already liked)
// @route   POST /api/posts/:postId/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

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

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId
        }
      }
    });

    let liked;

    if (existingLike) {
      // Already liked → unlike it (delete the like)
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      // Not liked → like it (create a like)
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId
        }
      });
      liked = true;

      // Notify the post author (but not if you liked your own post)
      await createNotification('POST_LIKE', userId, post.userId, postId, 'Post');
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId: postId }
    });

    res.json({
      success: true,
      data: {
        liked: liked,
        likeCount: likeCount
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error toggling like'
    });
  }
};

// @desc    Get users who liked a post
// @route   GET /api/posts/:postId/likes
// @access  Private
const getLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    const likes = await prisma.like.findMany({
      where: { postId: postId },
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
      data: likes
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching likes'
    });
  }
};

module.exports = {
  toggleLike,
  getLikes
};
