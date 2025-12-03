import * as mediaService from '../services/moviesService.js';
import { BadRequestError } from '../middleware/errorHandlingExpress.js';

// Search movies by name
export async function searchMoviesByName(req, res, next) {
  try {
    const { name } = req.query;
    if (!name) {
      throw new BadRequestError('Le paramètre "name" est requis');
    }
    
    const movies = await mediaService.searchMoviesByName(name);
    res.json(movies);
  } catch (error) {
    next(error);
  }
}
