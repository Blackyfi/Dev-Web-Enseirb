// Favorites routes
import express from 'express';
import * as favoritesController from '../controllers/favoritesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/zodValidation.js';
import { createFavoriteSchema, deleteFavoriteSchema } from '../validators/favoritesValidators.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /me/favorites - Get all favorites of the authenticated user
router.get('/favorites', favoritesController.getAllFavorites);

// POST /me/favorites - Create a new favorite
router.post('/favorites', validateRequest(createFavoriteSchema), favoritesController.createFavorite);

// PUT /me/favorites/:id - Update a favorite (rating and comment)
router.put('/favorites/:id', favoritesController.updateFavorite);

// DELETE /me/favorites/:id - Delete a favorite
router.delete('/favorites/:id', validateRequest(deleteFavoriteSchema), favoritesController.deleteFavorite);

export default router;
