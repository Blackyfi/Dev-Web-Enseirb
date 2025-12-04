import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as favoritesController from '../controllers/favoritesController.js';
import db from '../database/db.js';
import * as moviesService from '../services/moviesService.js';

vi.mock('../database/db.js');
vi.mock('../services/moviesService.js');

describe('favoritesController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { id: 1 } };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAllFavorites', () => {
    it('should return enriched favorites', async () => {
      const mockFavorites = [
        { id: 1, tmdbId: 123, type: 'movie', rating: 5, comment: 'Great', created_at: '2024-01-01' }
      ];
      const mockDetails = {
        title: 'Test Movie',
        poster_path: '/test.jpg',
        overview: 'Test overview',
        vote_average: 8.5,
        release_date: '2024-01-01'
      };

      vi.mocked(db.execute).mockResolvedValue([mockFavorites]);
      vi.mocked(moviesService.getMovieDetails).mockResolvedValue(mockDetails);

      await favoritesController.getAllFavorites(req, res, next);

      expect(db.execute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 1,
          tmdbId: 123,
          title: 'Test Movie'
        })
      ]);
    });

    it('should return favorites even if TMDB enrichment fails', async () => {
      const mockFavorites = [
        { id: 1, tmdbId: 123, type: 'movie', rating: 5, comment: 'Great', created_at: '2024-01-01' }
      ];

      vi.mocked(db.execute).mockResolvedValue([mockFavorites]);
      vi.mocked(moviesService.getMovieDetails).mockRejectedValue(new Error('TMDB error'));

      await favoritesController.getAllFavorites(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockFavorites[0]]);
    });

    it('should call next with error when database fails', async () => {
      const error = new Error('Database error');
      vi.mocked(db.execute).mockRejectedValue(error);

      await favoritesController.getAllFavorites(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createFavorite', () => {
    it('should create favorite when it does not exist', async () => {
      req.body = { tmdbId: 123, type: 'movie', rating: 5, comment: 'Great' };

      vi.mocked(db.execute)
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      await favoritesController.createFavorite(req, res, next);

      expect(db.execute).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        tmdbId: 123,
        type: 'movie',
        rating: 5,
        comment: 'Great',
        message: 'Favori ajouté avec succès'
      });
    });

    it('should call next with error when favorite already exists', async () => {
      req.body = { tmdbId: 123, type: 'movie' };
      vi.mocked(db.execute).mockResolvedValue([[{ id: 1 }]]);

      await favoritesController.createFavorite(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle null rating and comment', async () => {
      req.body = { tmdbId: 123, type: 'movie' };

      vi.mocked(db.execute)
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      await favoritesController.createFavorite(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: undefined,
          comment: undefined
        })
      );
    });
  });

  describe('deleteFavorite', () => {
    it('should delete favorite when it exists and belongs to user', async () => {
      req.params.id = '1';

      vi.mocked(db.execute)
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([{}]);

      await favoritesController.deleteFavorite(req, res, next);

      expect(db.execute).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should call next with error when favorite not found', async () => {
      req.params.id = '999';
      vi.mocked(db.execute).mockResolvedValue([[]]);

      await favoritesController.deleteFavorite(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should call next with error when database fails', async () => {
      req.params.id = '1';
      const error = new Error('Database error');
      vi.mocked(db.execute).mockRejectedValue(error);

      await favoritesController.deleteFavorite(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
