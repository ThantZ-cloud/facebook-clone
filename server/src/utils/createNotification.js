const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a notification for a user.
 * Never notifies the actor (you don't get notified for your own actions).
 *
 * @param {string} type - FRIEND_REQUEST, FRIEND_REQUEST_ACCEPTED, POST_LIKE, POST_COMMENT
 * @param {number} actorId - Who performed the action
 * @param {number} recipientId - Who should receive the notification
 * @param {number} referenceId - ID of the related entity
 * @param {string} referenceType - "FriendRequest", "Post", or "Comment"
 */
const createNotification = async (type, actorId, recipientId, referenceId, referenceType) => {
  // Never notify yourself
  if (actorId === recipientId) return;

  try {
    await prisma.notification.create({
      data: {
        type,
        actorId,
        recipientId,
        referenceId,
        referenceType
      }
    });
  } catch (error) {
    // Log but don't crash the main request if notification fails
    console.error('Create notification error:', error);
  }
};

module.exports = { createNotification };
