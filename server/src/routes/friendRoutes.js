const express = require('express');
const router = express.Router();
const {
  sendRequest,
  respondToRequest,
  getFriends,
  getPendingRequests,
  removeFriend
} = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

// Get friends list — GET /api/friends
router.get('/', protect, getFriends);

// Get pending requests — GET /api/friends/requests
router.get('/requests', protect, getPendingRequests);

// Send friend request — POST /api/friends/request/:id
router.post('/request/:id', protect, sendRequest);

// Accept/reject request — PUT /api/friends/request/:id
router.put('/request/:id', protect, respondToRequest);

// Remove friend — DELETE /api/friends/:id
router.delete('/:id', protect, removeFriend);

module.exports = router;
