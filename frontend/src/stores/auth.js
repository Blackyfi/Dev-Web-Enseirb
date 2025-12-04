<<<<<<< HEAD
/**
 * Store Pinia pour l'authentification
 * Gère l'état de l'utilisateur et du token
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.firstName || user.value?.email || 'Utilisateur')

  /**
   * Initialiser le store depuis localStorage
   */
  const init = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedRefreshToken = localStorage.getItem('auth_refresh_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Erreur lors du parsing du user:', e)
        localStorage.removeItem('auth_user')
      }
    }
  }

  /**
   * Sauvegarder dans localStorage
   */
  const persistAuth = () => {
    if (token.value) {
      localStorage.setItem('auth_token', token.value)
    } else {
      localStorage.removeItem('auth_token')
    }

    if (refreshToken.value) {
      localStorage.setItem('auth_refresh_token', refreshToken.value)
    } else {
      localStorage.removeItem('auth_refresh_token')
    }

    if (user.value) {
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('auth_user')
    }
  }

  /**
   * Connexion
   */
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(email, password)

      token.value = response.token
      refreshToken.value = response.refreshToken
      user.value = response.user || { email }

      persistAuth()

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription
   */
  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)

      token.value = response.token
      user.value = response.user || userData

      persistAuth()

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  const logout = async () => {
    loading.value = true

    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      // Nettoyer le state et localStorage
      token.value = null
      user.value = null
      error.value = null
      persistAuth()
      loading.value = false
    }
  }

  /**
   * Récupérer l'utilisateur connecté
   */
  const fetchCurrentUser = async () => {
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      persistAuth()
      return userData
    } catch (err) {
      error.value = err.message
      // Si le token est invalide, déconnecter
      if (err.message.includes('401') || err.message.includes('token')) {
        await logout()
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Rafraîchir le token
   */
  const refreshAuthToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken.value)
      token.value = response.token
      refreshToken.value = response.refreshToken
      persistAuth()
      return response
    } catch (err) {
      error.value = err.message
      await logout()
      throw err
    }
  }

  // Initialiser au chargement du store
  init()

  return {
    // State
    user,
    token,
    refreshToken,
    loading,
    error,

    // Getters
    isAuthenticated,
    userName,

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshAuthToken,
    init,
=======
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setUser(userData) {
    user.value = userData
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout
>>>>>>> b43242a2191037a02c0b06e416dc3dce602f0e44
  }
})
