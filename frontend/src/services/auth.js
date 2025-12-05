/**
 * Service d'authentification
 */

import api from './api'

/**
 * Connexion d'un utilisateur
 */
export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password })
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (userData) => {
  return await api.post('/auth/register', userData)
}

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async () => {
  return true
}

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export const getCurrentUser = async () => {
  return await api.get('/auth/me')
}

/**
 * Récupérer le profil utilisateur
 */
export const getProfile = async () => {
  return await api.get('/me/profile')
}

/**
 * Mettre à jour le profil utilisateur
 */
export const updateProfile = async (data) => {
  return await api.put('/me/profile', data)
}

/**
 * Rafraîchir le token d'authentification
 */
export const refreshToken = async (refreshToken) => {
  return await api.post('/auth/refresh', { refreshToken })
}

export default { login, register, logout, getCurrentUser, getProfile, updateProfile, refreshToken }

