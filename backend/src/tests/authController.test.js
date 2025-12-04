import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authController from '../controllers/authController.js';
import * as userService from '../services/userService.js';
import * as jwtutil from '../utils/jwt.js';

vi.mock('../services/userService.js');
vi.mock('../utils/jwt.js');

describe('authController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@test.com' };
      const mockToken = 'mock-jwt-token';

      vi.mocked(userService.authenticateUser).mockResolvedValue(mockUser);
      vi.mocked(jwtutil.createToken).mockReturnValue(mockToken);

      await authController.login(req, res, next);

      expect(userService.authenticateUser).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(jwtutil.createToken).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when credentials are invalid', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      vi.mocked(userService.authenticateUser).mockResolvedValue(null);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const error = new Error('Database error');
      vi.mocked(userService.authenticateUser).mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('register', () => {
    it('should create user and return 201', async () => {
      req.body = { email: 'new@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'new@test.com' };
      vi.mocked(userService.createUser).mockResolvedValue(mockUser);

      await authController.register(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith('new@test.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { id: 1, email: 'new@test.com' }
      });
    });

    it('should call next with error when user creation fails', async () => {
      req.body = { email: 'new@test.com', password: 'password123' };
      const error = new Error('Email exists');
      vi.mocked(userService.createUser).mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      await authController.logout(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });

  describe('refreshToken', () => {
    it('should return new token when valid', async () => {
      req.body = { token: 'old-token' };
      const mockDecoded = { id: 1, email: 'test@test.com' };
      const mockNewToken = 'new-token';

      vi.mocked(jwtutil.verifyToken).mockReturnValue(mockDecoded);
      vi.mocked(jwtutil.createToken).mockReturnValue(mockNewToken);

      await authController.refreshToken(req, res);

      expect(jwtutil.verifyToken).toHaveBeenCalledWith('old-token');
      expect(jwtutil.createToken).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
      expect(res.json).toHaveBeenCalledWith({ token: mockNewToken });
    });

    it('should return 401 when token is invalid', async () => {
      req.body = { token: 'invalid-token' };
      vi.mocked(jwtutil.verifyToken).mockReturnValue(null);

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
  });
});
