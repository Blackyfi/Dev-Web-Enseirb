import express from 'express';
import * as mediaController from '../controllers/moviesController.js';

const router = express.Router();

// Get trending TV series
router.get('/trending', mediaController.getTrendingSeries);

// Get popular TV series
router.get('/popular', mediaController.getPopularSeries);

// Get TV series details by ID (must be after /trending and /popular)
router.get('/:id', mediaController.getTvDetails);

export default router;
