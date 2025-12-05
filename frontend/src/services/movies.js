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
  getMovieDetails,
  getTrendingMovies,
  getTrendingSeries,
  getPopularMovies,
  getPopularSeries,
}
