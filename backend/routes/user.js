// user.js
const express = require('express');
const { signupUser, loginUser, getUserProfile } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/requireAuth');

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;

