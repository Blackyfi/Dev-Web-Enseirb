// Authentication routes (login, register, logout, refresh token)
import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateRequest } from '../middleware/zodValidation.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/authValidators.js';

const router = express.Router();

// User login
router.post('/login', validateRequest(loginSchema), authController.login);

// User registration
router.post('/register', validateRequest(registerSchema), authController.register);

// User logout
router.post('/logout', authController.logout);

// Token refresh
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

export default router;