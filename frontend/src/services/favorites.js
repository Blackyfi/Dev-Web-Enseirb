/**
 * Service pour la gestion des favoris
 */

import api from './api'

/**
 * Récupérer tous les favoris de l'utilisateur
 */
export const getAllFavorites = async () => {
  return await api.get('/me/favorites')
}

/**
 * Ajouter un film/série aux favoris
 */
export const addFavorite = async (favoriteData) => {
  return await api.post('/me/favorites', favoriteData)
}

/**
 * Supprimer un favori
 */
export const deleteFavorite = async (favoriteId) => {
  await api.delete(`/me/favorites/${favoriteId}`)
}

export default { getAllFavorites, addFavorite, deleteFavorite }
