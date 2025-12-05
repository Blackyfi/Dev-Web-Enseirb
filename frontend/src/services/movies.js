/**
 * Service pour la recherche de films et séries
 */

import api from './api'

/**
 * Rechercher des films par nom
 * @param {string} query - Terme de recherche
 * @returns {Promise<Array>} Liste des films
 */
export const searchMovies = async (query) => {
  const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`)
  return response
}

/**
 * Rechercher des séries par nom
 * @param {string} query - Terme de recherche
 * @returns {Promise<Array>} Liste des séries
 */
export const searchSeries = async (query) => {
  const response = await api.get(`/tv/search?q=${encodeURIComponent(query)}`)
  return response
}

/**
 * Recherche multi (films, séries ou les deux)
 * @param {string} query - Terme de recherche
 * @param {string} type - Type de recherche ('all', 'movie', 'tv')
 * @returns {Promise<Array>} Liste des résultats
 */
export const searchMulti = async (query, type = 'all') => {
  const response = await api.get(`/movies/search/multi?q=${encodeURIComponent(query)}&type=${type}`)
  return response
}

/**
 * Obtenir les détails d'un film ou d'une série
 * @param {number} movieId - ID TMDB du film/série
 * @param {string} type - Type de contenu ('movie' ou 'tv')
 * @returns {Promise<object>} Détails du film/série
 */
export const getMovieDetails = async (movieId, type = 'movie') => {
  const endpoint = type === 'tv' ? `/tv/${movieId}` : `/movies/${movieId}`
  const response = await api.get(endpoint)
  return response
}

/**
 * Obtenir les films tendances du moment
 * @returns {Promise<Array>} Liste des films tendances
 */
export const getTrendingMovies = async () => {
  const response = await api.get('/movies/trending')
  return response
}

/**
 * Obtenir les séries tendances du moment
 * @returns {Promise<Array>} Liste des séries tendances
 */
export const getTrendingSeries = async () => {
  const response = await api.get('/tv/trending')
  return response
}

/**
 * Obtenir les films populaires
 * @returns {Promise<Array>} Liste des films populaires
 */
export const getPopularMovies = async () => {
  const response = await api.get('/movies/popular')
  return response
}

/**
 * Obtenir les séries populaires
 * @returns {Promise<Array>} Liste des séries populaires
 */
export const getPopularSeries = async () => {
  const response = await api.get('/tv/popular')
  return response
}

export default {
  searchMovies,
  searchSeries,
  searchMulti,
  getMovieDetails,
  getTrendingMovies,
  getTrendingSeries,
  getPopularMovies,
  getPopularSeries,
}
