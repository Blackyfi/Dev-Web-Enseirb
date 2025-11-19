// TMDB API configuration

import XMLHttpRequest from 'xhr2';

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
      const data = JSON.parse(xhr.responseText);
      xhr.status >= 200 && xhr.status < 300
        ? resolve(data)
        : reject(new Error(data.status_message || `TMDB API error: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}
