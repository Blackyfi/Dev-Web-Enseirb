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
 * Rafraîchir le token d'authentification
 */
export const refreshToken = async (refreshToken) => {
  return await api.post('/auth/refresh', { refreshToken })
}

export default { login, register, logout, getCurrentUser, refreshToken }
