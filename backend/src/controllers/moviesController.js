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

// Get movie details by ID
export async function getMovieDetails(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await mediaService.getMovieDetails(id);
    res.json(movie);
  } catch (error) {
    next(error);
  }
}

// Get TV series details by ID
export async function getTvDetails(req, res, next) {
  try {
    const { id } = req.params;
    const series = await mediaService.getTvDetails(id);
    res.json(series);
  } catch (error) {
    next(error);
  }
}

// Get trending movies
export async function getTrendingMovies(req, res, next) {
  try {
    const movies = await mediaService.getTrendingMovies();
    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
}

// Get trending TV series
export async function getTrendingSeries(req, res, next) {
  try {
    const series = await mediaService.getTrendingSeries();
    res.json({ results: series });
  } catch (error) {
    next(error);
  }
}

// Get popular movies
export async function getPopularMovies(req, res, next) {
  try {
    const movies = await mediaService.getPopularMovies();
    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
}

// Get popular TV series
export async function getPopularSeries(req, res, next) {
  try {
    const series = await mediaService.getPopularSeries();
    res.json({ results: series });
  } catch (error) {
    next(error);
  }
}
