// Favorites controller
import db from '../database/db.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../middleware/errorHandlingExpress.js';
import * as moviesService from '../services/moviesService.js';

/**
 * Get all favorites for the authenticated user
 */
export async function getAllFavorites(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) throw new UnauthorizedError('Need to be logged in');

    const query = 'SELECT id, movie_id as tmdbId, type, rating, comment, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC';
    const [results] = await db.execute(query, [userId]);

    // Enrichir chaque favori avec les détails TMDB
    const enrichedFavorites = await Promise.all(
      results.map(async (favorite) => {
        try {
          // Appeler la bonne fonction selon le type
          const details = favorite.type === 'tv'
            ? await moviesService.getTvDetails(favorite.tmdbId)
            : await moviesService.getMovieDetails(favorite.tmdbId);

          return {
            ...favorite,
            title: details.title || details.name,
            name: details.name || details.title,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
            overview: details.overview,
            vote_average: details.vote_average,
            release_date: details.release_date || details.first_air_date,
            first_air_date: details.first_air_date || details.release_date,
          };
        } catch (error) {
          // Si erreur TMDB, retourner juste les données de base
          console.error(`Erreur enrichissement favori ${favorite.id}:`, error.message);
          return favorite;
        }
      })
    );

    return res.status(200).json(enrichedFavorites);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new favorite
 */
export async function createFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) throw new UnauthorizedError('Need to be logged in');

    const { tmdbId, type, rating, comment } = req.body;

    // Check if favorite already exists
    const checkQuery = 'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?';
    const [checkResults] = await db.execute(checkQuery, [userId, tmdbId]);

    if (checkResults && checkResults.length > 0) {
      throw new ConflictError('Le favori existe déjà');
    }

    // Insert new favorite
    const insertQuery = 'INSERT INTO favorites (user_id, movie_id, type, rating, comment) VALUES (?, ?, ?, ?, ?)';
    const insertParams = [userId, tmdbId, type.toLowerCase(), rating || null, comment || null];

    const [result] = await db.execute(insertQuery, insertParams);

    return res.status(201).json({
      id: result.insertId,
      tmdbId,
      type,
      rating,
      comment,
      message: 'Favori ajouté avec succès'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a favorite
 */
export async function deleteFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) throw new UnauthorizedError('Need to be logged in');

    const favoriteId = req.params.id;

    // Check if favorite belongs to user
    const checkQuery = 'SELECT id FROM favorites WHERE id = ? AND user_id = ?';
    const [checkResults] = await db.execute(checkQuery, [favoriteId, userId]);

    if (!checkResults || checkResults.length === 0) {
      throw new NotFoundError('Favori non trouvé ou non autorisé');
    }

    // Delete favorite
    const deleteQuery = 'DELETE FROM favorites WHERE id = ? AND user_id = ?';
    await db.execute(deleteQuery, [favoriteId, userId]);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Update a favorite (rating and comment)
 */
export async function updateFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) throw new UnauthorizedError('Need to be logged in');

    const favoriteId = req.params.id;
    const { rating, comment } = req.body;

    // Check if favorite belongs to user
    const checkQuery = 'SELECT id FROM favorites WHERE id = ? AND user_id = ?';
    const [checkResults] = await db.execute(checkQuery, [favoriteId, userId]);

    if (!checkResults || checkResults.length === 0) {
      throw new NotFoundError('Favori non trouvé ou non autorisé');
    }

    // Validate rating (1-5 or null)
    if (rating !== null && rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error('La note doit être entre 1 et 5');
    }

    // Update favorite
    const updateQuery = 'UPDATE favorites SET rating = ?, comment = ? WHERE id = ? AND user_id = ?';
    await db.execute(updateQuery, [rating || null, comment || null, favoriteId, userId]);

    return res.status(200).json({
      id: parseInt(favoriteId),
      rating: rating || null,
      comment: comment || null,
      message: 'Favori mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
}
