// Movies service handling TMDB API data and operations

import { tmdbFetch } from '../utils/tmdbConfig.js';
import * as cacheService from './cacheService.js';

/**
 * Recherche de films par nom avec mise en cache
 * @param {string} name - Nom du film à rechercher
 * @returns {Promise<Array>} Liste des résultats
 */
export async function searchMoviesByName(name) {
  // Normaliser la clé de cache (lowercase, trim)
  const cacheKey = `movie:search:${name.toLowerCase().trim()}`;

  // Vérifier le cache
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Si pas en cache, appeler l'API TMDB
  const data = await tmdbFetch('/search/movie', { query: name });
  const results = data.results || [];

  // Stocker dans le cache
  cacheService.set(cacheKey, results);

  return results;
}

/**
 * Recherche de séries TV par nom avec mise en cache
 * @param {string} name - Nom de la série à rechercher
 * @returns {Promise<Array>} Liste des résultats
 */
export async function searchSeriesByName(name) {
  const cacheKey = `tv:search:${name.toLowerCase().trim()}`;

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/search/tv', { query: name });
  const results = data.results || [];

  cacheService.set(cacheKey, results);

  return results;
}

/**
 * Recherche multi-média (films et séries)
 * @param {string} query - Texte de recherche
 * @param {string} type - Type de recherche ('all', 'movie', 'tv')
 * @returns {Promise<Array>} Liste des résultats
 */
export async function searchMulti(query, type = 'all') {
  const cacheKey = `${type}:search:${query.toLowerCase().trim()}`;

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  let results = [];

  if (type === 'all') {
    // Recherche multi (films + séries)
    const data = await tmdbFetch('/search/multi', { query });
    results = data.results || [];
  } else if (type === 'movie') {
    // Recherche uniquement films
    const data = await tmdbFetch('/search/movie', { query });
    results = data.results || [];
  } else if (type === 'tv') {
    // Recherche uniquement séries
    const data = await tmdbFetch('/search/tv', { query });
    results = data.results || [];
  }

  cacheService.set(cacheKey, results);

  return results;
}

/**
 * Obtenir les détails d'un film
 * @param {number} movieId - ID TMDB du film
 * @returns {Promise<object>} Détails du film
 */
export async function getMovieDetails(movieId) {
  const cacheKey = `movie:details:${movieId}`;

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch(`/movie/${movieId}`);

  cacheService.set(cacheKey, data);

  return data;
}

/**
 * Obtenir les détails d'une série TV
 * @param {number} tvId - ID TMDB de la série
 * @returns {Promise<object>} Détails de la série
 */
export async function getTvDetails(tvId) {
  const cacheKey = `tv:details:${tvId}`;

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch(`/tv/${tvId}`);

  cacheService.set(cacheKey, data);

  return data;
}

/**
 * Obtenir les films tendances
 * @returns {Promise<Array>} Liste des films tendances
 */
export async function getTrendingMovies() {
  const cacheKey = 'movies:trending:week';

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/trending/movie/week');
  const results = data.results || [];

  // Cache pour 6 heures (les tendances changent lentement)
  cacheService.set(cacheKey, results, 6 * 60 * 60 * 1000);

  return results;
}

/**
 * Obtenir les séries tendances
 * @returns {Promise<Array>} Liste des séries tendances
 */
export async function getTrendingSeries() {
  const cacheKey = 'tv:trending:week';

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/trending/tv/week');
  const results = data.results || [];

  cacheService.set(cacheKey, results, 6 * 60 * 60 * 1000);

  return results;
}

/**
 * Obtenir les films populaires
 * @returns {Promise<Array>} Liste des films populaires
 */
export async function getPopularMovies() {
  const cacheKey = 'movies:popular';

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/movie/popular');
  const results = data.results || [];

  cacheService.set(cacheKey, results, 6 * 60 * 60 * 1000);

  return results;
}

/**
 * Obtenir les séries populaires
 * @returns {Promise<Array>} Liste des séries populaires
 */
export async function getPopularSeries() {
  const cacheKey = 'tv:popular';

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/tv/popular');
  const results = data.results || [];

  cacheService.set(cacheKey, results, 6 * 60 * 60 * 1000);

  return results;
}
