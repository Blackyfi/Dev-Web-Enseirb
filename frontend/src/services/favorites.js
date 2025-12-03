/**
 * Service pour la gestion des favoris
 */

import api from './api'

/**
 * Récupérer tous les favoris de l'utilisateur
 * @returns {Promise<Array>} Liste des favoris
 */
export const getAllFavorites = async () => {
  const response = await api.get('/me/favorites')
  return response
}

/**
 * Ajouter un film/série aux favoris
 * @param {object} favoriteData - Données du favori
 * @param {number} favoriteData.tmdbId - ID TMDB du film/série
 * @param {string} favoriteData.type - Type (movie ou tv)
 * @param {number} [favoriteData.rating] - Note (optionnel)
 * @param {string} [favoriteData.comment] - Commentaire (optionnel)
 * @returns {Promise<object>} Favori créé
 */
export const addFavorite = async (favoriteData) => {
  const response = await api.post('/me/favorites', favoriteData)
  return response
}

/**
 * Supprimer un favori
 * @param {number} favoriteId - ID du favori
 * @returns {Promise<void>}
 */
export const deleteFavorite = async (favoriteId) => {
  await api.delete(`/me/favorites/${favoriteId}`)
}

/**
 * Vérifier si un film/série est dans les favoris
 * @param {Array} favorites - Liste des favoris
 * @param {number} tmdbId - ID TMDB à vérifier
 * @returns {object|null} Le favori s'il existe, null sinon
 */
export const findFavorite = (favorites, tmdbId) => {
  return favorites.find(fav => fav.tmdbId === tmdbId) || null
}

export default {
  getAllFavorites,
  addFavorite,
  deleteFavorite,
  findFavorite,
}
