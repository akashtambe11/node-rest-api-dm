const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');
const checkAuth = require('../middleware/check-auth');

// Signup for new User
router.post('/signup', UserController.user_signup);

// Login for existing Users
router.post('/login', UserController.user_login);

// To Delete Users
router.delete('/:userId', checkAuth, UserController.user_delete);

// To export Router
module.exports = router; 