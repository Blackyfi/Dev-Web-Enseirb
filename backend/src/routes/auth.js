// Authentication routes (login, register, logout, refresh token)
import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// User login
router.post('/login', authController.login);

// User registration
router.post('/register', authController.register);

// User logout
router.post('/logout', authController.logout);

// Token refresh
router.post('/refresh-token', authController.refreshToken);

export default router;