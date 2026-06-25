const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get a user's profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            // Count friends from both sides of the Friendship table
            friends: true,     // where user is userA
            friendsOf: true,   // where user is userB
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Total friend count = friends (as userA) + friendsOf (as userB)
    const friendCount = user._count.friends + user._count.friendsOf;

    // Check if the current user is friends with this user
    const currentUserId = req.user.id;
    let isFriend = false;
    let hasPendingRequest = false;

    if (currentUserId !== userId) {
      // Check friendship — Friendship is bidirectional, so check both orderings
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userAId: currentUserId, userBId: userId },
            { userAId: userId, userBId: currentUserId }
          ]
        }
      });
      isFriend = !!friendship;

      // Check if there's a pending friend request between them
      if (!isFriend) {
        const pendingRequest = await prisma.friendRequest.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: userId, status: 'PENDING' },
              { senderId: userId, receiverId: currentUserId, status: 'PENDING' }
            ]
          }
        });
        hasPendingRequest = !!pendingRequest;
      }
    }

    res.json({
      success: true,
      data: {
        ...user,
        friendCount,
        isFriend,
        hasPendingRequest
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching user profile'
    });
  }
};

// @desc    Update current user's profile (name, bio)
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user.id;

    // Build update data — only include fields that were sent
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating profile'
    });
  }
};

// @desc    Upload avatar image
// @route   POST /api/users/me/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const userId = req.user.id;
    // Build the URL path to the uploaded file
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        avatar: true,
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error uploading avatar'
    });
  }
};

// @desc    Upload cover photo
// @route   POST /api/users/me/cover
// @access  Private
const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const userId = req.user.id;
    const coverUrl = `/uploads/covers/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { coverPhoto: coverUrl },
      select: {
        id: true,
        name: true,
        coverPhoto: true,
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Upload cover photo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error uploading cover photo'
    });
  }
};

// @desc    Search users by name
// @route   GET /api/users/search?q=
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Search for users whose name contains the query (case-insensitive)
    // SQLite uses LIKE which is case-insensitive by default
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: q.trim()
        },
        // Exclude the current user from results
        NOT: { id: req.user.id }
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
      },
      take: 20  // Limit results
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error searching users'
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadCoverPhoto,
  searchUsers
};
