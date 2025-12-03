// LRU Cache service pour les requêtes API externes
import { LRUCache } from 'lru-cache';

// Configuration du cache LRU
// TTL de 10 minutes comme spécifié dans le sujet
const cache = new LRUCache({
  max: 500, // Maximum 500 entrées
  ttl: 1000 * 60 * 10, // 10 minutes en millisecondes
  updateAgeOnGet: false, // Ne pas réinitialiser le TTL lors de la lecture
  updateAgeOnHas: false,
});

// Statistiques de cache
let stats = {
  hits: 0,
  misses: 0,
  sets: 0,
};

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé de cache
 * @returns {any|null} Valeur en cache ou null
 */
export function get(key) {
  const value = cache.get(key);

  if (value !== undefined) {
    stats.hits++;
    console.log(`[CACHE HIT] Key: ${key} | Total hits: ${stats.hits}, misses: ${stats.misses}`);
    return value;
  }

  stats.misses++;
  console.log(`[CACHE MISS] Key: ${key} | Total hits: ${stats.hits}, misses: ${stats.misses}`);
  return null;
}

/**
 * Stocke une valeur dans le cache
 * @param {string} key - Clé de cache
 * @param {any} value - Valeur à stocker
 */
export function set(key, value) {
  cache.set(key, value);
  stats.sets++;
  console.log(`[CACHE SET] Key: ${key} | Cache size: ${cache.size}`);
}

/**
 * Supprime une entrée du cache
 * @param {string} key - Clé à supprimer
 */
export function del(key) {
  cache.delete(key);
  console.log(`[CACHE DELETE] Key: ${key}`);
}

/**
 * Vide complètement le cache
 */
export function clear() {
  const previousSize = cache.size;
  cache.clear();
  console.log(`[CACHE CLEAR] Cleared ${previousSize} entries`);
}

/**
 * Récupère les statistiques du cache
 * @returns {object} Statistiques
 */
export function getStats() {
  return {
    ...stats,
    size: cache.size,
    max: cache.max,
    hitRate: stats.hits + stats.misses > 0
      ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2) + '%'
      : '0%'
  };
}

/**
 * Réinitialise les statistiques
 */
export function resetStats() {
  stats = {
    hits: 0,
    misses: 0,
    sets: 0,
  };
  console.log('[CACHE] Statistics reset');
}

export default {
  get,
  set,
  del,
  clear,
  getStats,
  resetStats,
};
