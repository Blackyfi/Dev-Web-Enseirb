/**
 * Service d'authentification
 * Gère les appels aux endpoints d'authentification
 * Note: La gestion du token est maintenant dans le store Pinia (stores/auth.js)
 */

import api from './api'

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<object>} Les données de l'utilisateur et le token
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  })
  return response
}

/**
 * Inscription d'un nouvel utilisateur
 * @param {object} userData - Données de l'utilisateur (email, password, name, etc.)
 * @returns {Promise<object>} Les données de l'utilisateur créé
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response
}

/**
 * Déconnexion de l'utilisateur
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // Appeler l'endpoint de déconnexion si votre API en a un
  // await api.post('/auth/logout')
  return true
}

/**
 * Récupérer les informations de l'utilisateur connecté
 * @returns {Promise<object>} Les données de l'utilisateur
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response
}

/**
 * Rafraîchir le token d'authentification
 * @param {string} refreshToken - Le refresh token
 * @returns {Promise<object>} Les nouveaux tokens
 */
export const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken })
  return response
}

/**
 * Demander la réinitialisation du mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<object>}
 */
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/password-reset/request', { email })
  return response
}

/**
 * Réinitialiser le mot de passe
 * @param {string} token - Token de réinitialisation
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<object>}
 */
export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/password-reset/confirm', {
    token,
    newPassword,
  })
  return response
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
}
