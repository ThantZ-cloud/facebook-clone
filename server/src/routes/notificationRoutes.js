const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Get all notifications — GET /api/notifications
router.get('/', protect, getNotifications);

// Get unread count — GET /api/notifications/unread-count
router.get('/unread-count', protect, getUnreadCount);

// Mark single as read — PUT /api/notifications/:id/read
router.put('/:id/read', protect, markAsRead);

// Mark all as read — PUT /api/notifications/read-all
router.put('/read-all', protect, markAllAsRead);

module.exports = router;
