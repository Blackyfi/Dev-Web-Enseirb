import express from 'express';
import * as mediaController from '../controllers/moviesController.js';
import { validateRequest } from '../middleware/zodValidation.js';
import { searchMoviesSchema } from '../validators/moviesValidators.js';

const router = express.Router();

// Multi-search (films, séries ou les deux)
router.get('/search/multi', validateRequest(searchMoviesSchema), mediaController.searchMulti);

// Search movie by name (name or q parameter)
router.get('/search', validateRequest(searchMoviesSchema), mediaController.searchMoviesByName);

// Get trending movies
router.get('/trending', mediaController.getTrendingMovies);

// Get popular movies
router.get('/popular', mediaController.getPopularMovies);

// Get movie details by ID (must be after /trending and /popular)
router.get('/:id', mediaController.getMovieDetails);

export default router;
