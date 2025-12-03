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
 * Obtenir les détails d'un film
 * @param {number} movieId - ID TMDB du film
 * @returns {Promise<object>} Détails du film
 */
export const getMovieDetails = async (movieId) => {
  const response = await api.get(`/movies/${movieId}`)
  return response
}

export default {
  searchMovies,
  getMovieDetails,
}
