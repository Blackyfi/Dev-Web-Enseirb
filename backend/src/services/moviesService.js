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
 * Recherche multi-média (films et séries)
 * @param {string} query - Texte de recherche
 * @returns {Promise<Array>} Liste des résultats
 */
export async function searchMulti(query) {
  const cacheKey = `multi:search:${query.toLowerCase().trim()}`;

  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const data = await tmdbFetch('/search/multi', { query });
  const results = data.results || [];

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
