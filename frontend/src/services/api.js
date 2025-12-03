/**
 * Service API principal
 * Gère la configuration de base et les requêtes HTTP
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090'

/**
 * Configuration par défaut pour les requêtes
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
}

/**
 * Fonction principale pour effectuer des requêtes HTTP
 * @param {string} endpoint - L'endpoint de l'API (ex: '/auth/login')
 * @param {object} options - Options de la requête (method, body, headers, etc.)
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  // Préparer les headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  }

  // Ajouter le token d'authentification depuis localStorage si disponible
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Configuration de la requête
  const config = {
    ...options,
    headers,
  }

  // Convertir le body en JSON si nécessaire
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)

    // Gérer les erreurs HTTP
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Erreur HTTP ${response.status}: ${response.statusText}`
      }))
      throw new Error(error.error?.message || error.message || 'Une erreur est survenue')
    }

    // Gérer les réponses sans contenu (204 No Content)
    if (response.status === 204) {
      return null
    }

    // Retourner la réponse JSON
    return await response.json()
  } catch (error) {
    // Gérer les erreurs réseau ou de parsing
    console.error('Erreur API:', error)
    throw error
  }
}

/**
 * Méthodes raccourcies pour les requêtes HTTP
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body }),

  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PATCH', body }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

export default api
