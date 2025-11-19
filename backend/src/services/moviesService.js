// Movies service handling TMDB API data and operations

import { tmdbFetch } from '../utils/tmdbConfig.js';

// Get movie by name
export async function searchMoviesByName(name) {
  const data = await tmdbFetch('/search/movie', { query: name });
  return data.results;
}
