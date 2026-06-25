const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Send a friend request
// @route   POST /api/friends/request/:id
// @access  Private
const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = parseInt(req.params.id);

    // Can't send request to yourself
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot send a friend request to yourself'
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if they're already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: senderId, userBId: receiverId },
          { userAId: receiverId, userBId: senderId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        error: 'You are already friends with this user'
      });
    }

    // Check if a request already exists (in either direction)
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'PENDING') {
        return res.status(400).json({
          success: false,
          error: 'A friend request already exists between you and this user'
        });
      }

      // If a previous request was rejected, update it to pending
      const updated = await prisma.friendRequest.update({
        where: { id: existingRequest.id },
        data: { senderId, receiverId, status: 'PENDING' }
      });

      return res.json({
        success: true,
        data: updated
      });
    }

    // Create new friend request
    const friendRequest = await prisma.friendRequest.create({
      data: { senderId, receiverId }
    });

    res.status(201).json({
      success: true,
      data: friendRequest
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error sending friend request'
    });
  }
};

// @desc    Accept or reject a friend request
// @route   PUT /api/friends/request/:id
// @access  Private
const respondToRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const userId = req.user.id;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide status: ACCEPTED or REJECTED'
      });
    }

    // Find the request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found'
      });
    }

    // Only the receiver can respond to the request
    if (friendRequest.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only respond to requests sent to you'
      });
    }

    if (friendRequest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'This request has already been responded to'
      });
    }

    if (status === 'ACCEPTED') {
      // Accept: create a Friendship and update request status
      // Use a transaction to ensure both succeed or both fail
      const [updatedRequest, friendship] = await prisma.$transaction([
        prisma.friendRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' }
        }),
        prisma.friendship.create({
          data: {
            userAId: friendRequest.senderId,
            userBId: friendRequest.receiverId
          }
        })
      ]);

      return res.json({
        success: true,
        data: { friendRequest: updatedRequest, friendship }
      });
    }

    // Reject: just update the request status
    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });

    res.json({
      success: true,
      data: { friendRequest: updatedRequest }
    });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error responding to friend request'
    });
  }
};

// @desc    Get current user's friends list
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all friendships where the current user is involved
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      include: {
        // Include both users so we can extract the friend's info
        userA: {
          select: { id: true, name: true, avatar: true, bio: true }
        },
        userB: {
          select: { id: true, name: true, avatar: true, bio: true }
        }
      }
    });

    // Extract the friend (the OTHER user, not the current user)
    const friends = friendships.map(f => {
      return f.userAId === userId ? f.userB : f.userA;
    });

    res.json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching friends'
    });
  }
};

// @desc    Get pending friend requests (received by current user)
// @route   GET /api/friends/requests
// @access  Private
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        // Include the sender's info
        sender: {
          select: { id: true, name: true, avatar: true, bio: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching pending requests'
    });
  }
};

// @desc    Remove a friend
// @route   DELETE /api/friends/:id
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = parseInt(req.params.id);

    // Find the friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: friendId },
          { userAId: friendId, userBId: userId }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'You are not friends with this user'
      });
    }

    // Delete the friendship and any related friend requests
    await prisma.$transaction([
      prisma.friendship.delete({ where: { id: friendship.id } }),
      prisma.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId }
          ]
        }
      })
    ]);

    res.json({
      success: true,
      data: { message: 'Friend removed successfully' }
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error removing friend'
    });
  }
};

module.exports = {
  sendRequest,
  respondToRequest,
  getFriends,
  getPendingRequests,
  removeFriend
};
