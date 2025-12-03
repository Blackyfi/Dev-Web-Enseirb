import * as mediaService from '../services/moviesService.js';

// Search movies by name
export async function searchMoviesByName(req, res, next) {
  try {
    // Accepter "name" ou "q" comme paramètre de recherche
    const searchQuery = req.query.name || req.query.q;

    const movies = await mediaService.searchMoviesByName(searchQuery);
    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
}
