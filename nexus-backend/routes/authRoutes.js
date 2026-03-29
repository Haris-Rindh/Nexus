const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route using your middleware
router.get('/investor-dashboard', protect, authorize('investor'), (req, res) => {
    res.json({ message: 'Welcome to the private investor dashboard' });
});

module.exports = router;