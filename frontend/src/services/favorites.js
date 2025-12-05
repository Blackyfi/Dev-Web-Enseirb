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

/**
 * Mettre à jour un favori (rating et comment)
 */
export const updateFavorite = async (favoriteId, data) => {
  return await api.put(`/me/favorites/${favoriteId}`, data)
}

export default { getAllFavorites, addFavorite, deleteFavorite, updateFavorite }

