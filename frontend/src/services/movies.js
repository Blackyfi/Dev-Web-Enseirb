/**
 * Service pour la recherche de films et séries
 */

import api from './api'

/**
 * Recherche multi (films, séries ou les deux)
 */
export const searchMulti = async (query, type = 'all') => {
  return await api.get(`/movies/search/multi?q=${encodeURIComponent(query)}&type=${type}`)
}

/**
 * Obtenir les détails d'un film ou d'une série
 */
export const getMovieDetails = async (movieId, type = 'movie') => {
  const endpoint = type === 'tv' ? `/tv/${movieId}` : `/movies/${movieId}`
  return await api.get(endpoint)
}

/**
 * Obtenir les films tendances
 */
export const getTrendingMovies = async () => {
  return await api.get('/movies/trending')
}

/**
 * Obtenir les séries tendances
 */
export const getTrendingSeries = async () => {
  return await api.get('/tv/trending')
}

export default { searchMulti, getMovieDetails, getTrendingMovies, getTrendingSeries }
