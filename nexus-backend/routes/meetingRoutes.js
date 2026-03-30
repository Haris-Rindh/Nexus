const express = require('express');
const router = express.Router();
const { requestMeeting } = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only logged-in Entrepreneurs can request meetings with Investors
router.post('/', protect, authorize('entrepreneur'), requestMeeting);

module.exports = router;