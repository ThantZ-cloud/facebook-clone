const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? `/uploads/posts/${req.file.filename}` : null;

    // Must have either content or an image
    if (!content && !image) {
      return res.status(400).json({
        success: false,
        error: 'Please provide content or an image'
      });
    }

    // Create the post in the database
    const post = await prisma.post.create({
      data: {
        content: content || null,
        image: image,
        userId: req.user.id
      },
      include: {
        // Include user info and counts in the response
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    // Add "liked: false" since the creator hasn't liked it yet
    post.liked = false;

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating post'
    });
  }
};

// @desc    Get all posts (news feed)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    // Pagination: page number from query params, default page 1
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch posts with user info, counts, and whether current user liked each post
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // Newest first
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          where: { userId: req.user.id },
          select: { id: true }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    // Transform posts: add a "liked" boolean field
    const transformedPosts = posts.map(post => ({
      ...post,
      liked: post.likes.length > 0, // true if current user liked this post
      likes: undefined // Remove the likes array from response (we have _count.likes)
    }));

    res.json({
      success: true,
      data: transformedPosts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching posts'
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          where: { userId: req.user.id },
          select: { id: true }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Transform: add liked boolean
    const transformedPost = {
      ...post,
      liked: post.likes.length > 0,
      likes: undefined
    };

    res.json({
      success: true,
      data: transformedPost
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching post'
    });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    // Find the post first
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Only the owner can delete their post
    if (post.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }

    // Delete the image file from disk if it exists
    if (post.image) {
      const imagePath = path.join(__dirname, '../..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the post (comments and likes are cascade-deleted by Prisma)
    await prisma.post.delete({
      where: { id: postId }
    });

    res.json({
      success: true,
      data: { message: 'Post deleted' }
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting post'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost
};
