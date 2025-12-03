import express from 'express';
import * as mediaController from '../controllers/moviesController.js';
import { validateRequest } from '../middleware/zodValidation.js';
import { searchMoviesSchema } from '../validators/moviesValidators.js';

const router = express.Router();

// Search movie by name (name or q parameter)
router.get('/search', validateRequest(searchMoviesSchema), mediaController.searchMoviesByName);

export default router;
