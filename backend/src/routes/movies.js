import express from 'express';
import * as mediaController from '../controllers/moviesController.js';

const router = express.Router();

// Search movie by name (name in parameter)
router.get('/search', mediaController.searchMoviesByName);

export default router;
