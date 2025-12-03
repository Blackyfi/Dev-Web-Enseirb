// TMDB API configuration

import '../config/config.js'; // Ensure env vars are loaded
import XMLHttpRequest from 'xhr2';
import { TmdbApiError, TooManyRequestsError, ServiceUnavailableError, NotFoundError, UnauthorizedError } from '../middleware/errorHandlingExpress.js';

// Helper function to make TMDB API requests using XHR
export function tmdbFetch(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('language', 'fr-FR');

    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.append(key, value);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url.toString());
    xhr.setRequestHeader('Authorization', `Bearer ${TMDB_API_KEY}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          // Gestion des différents codes d'erreur TMDB
          const errorMessage = data.status_message || `Erreur TMDB API: ${xhr.status}`;
          
          switch (xhr.status) {
            case 401:
              reject(new UnauthorizedError('Clé API TMDB invalide ou manquante'));
              break;
            case 404:
              reject(new NotFoundError('Ressource non trouvée sur TMDB'));
              break;
            case 429:
              reject(new TooManyRequestsError('Limite de requêtes TMDB atteinte'));
              break;
            case 503:
              reject(new ServiceUnavailableError('TMDB temporairement indisponible'));
              break;
            default:
              reject(new TmdbApiError(xhr.status, errorMessage));
          }
        }
      } catch (parseError) {
        console.error('[TMDB] Erreur de parsing JSON:', parseError);
        reject(new TmdbApiError(xhr.status, 'Réponse TMDB invalide', parseError));
      }
    };

    xhr.onerror = () => {
      console.error('[TMDB] Erreur réseau');
      reject(new ServiceUnavailableError('Impossible de contacter TMDB'));
    };
    
    xhr.ontimeout = () => {
      console.error('[TMDB] Timeout');
      reject(new ServiceUnavailableError('TMDB ne répond pas (timeout)'));
    };
    
    // Timeout de 10 secondes
    xhr.timeout = 10000;
    
    xhr.send();
  });
}
