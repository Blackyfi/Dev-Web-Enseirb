// Authentication routes (login, register, logout, refresh token)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User login
router.post('/login', authController.login);

// User registration
router.post('/register', authController.register);

// User logout
router.post('/logout', authController.logout);

// Token refresh
router.post('/refresh-token', authController.refreshToken);

module.exports = router;