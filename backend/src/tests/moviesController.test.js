import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as mediaController from '../controllers/moviesController.js';
import * as moviesService from '../services/moviesService.js';

vi.mock('../services/moviesService.js');

describe('moviesController - Movies', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('searchMoviesByName', () => {
        it('should return search results when using name parameter', async () => {
            const mockResults = [{ id: 1, title: 'Test Movie' }];
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchMoviesByName).mockResolvedValue(mockResults);

            await mediaController.searchMoviesByName(req, res, next);

            expect(moviesService.searchMoviesByName).toHaveBeenCalledWith('Test');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should return search results when using q parameter', async () => {
            const mockResults = [{ id: 1, title: 'Test Movie' }];
            req.query = { q: 'Test' };
            vi.mocked(moviesService.searchMoviesByName).mockResolvedValue(mockResults);

            await mediaController.searchMoviesByName(req, res, next);

            expect(moviesService.searchMoviesByName).toHaveBeenCalledWith('Test');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should call next with error on failure', async () => {
            const error = new Error('Service error');
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchMoviesByName).mockRejectedValue(error);

            await mediaController.searchMoviesByName(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getMovieDetails', () => {
        it('should return movie details', async () => {
            const mockMovie = { id: 1, title: 'Test Movie', overview: 'Test' };
            req.params = { id: '1' };
            vi.mocked(moviesService.getMovieDetails).mockResolvedValue(mockMovie);

            await mediaController.getMovieDetails(req, res, next);

            expect(moviesService.getMovieDetails).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(mockMovie);
        });
    });

    describe('getTrendingMovies', () => {
        it('should return trending movies', async () => {
            const mockResults = [{ id: 1, title: 'Trending Movie' }];
            vi.mocked(moviesService.getTrendingMovies).mockResolvedValue(mockResults);

            await mediaController.getTrendingMovies(req, res, next);

            expect(moviesService.getTrendingMovies).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });
    });

    describe('getPopularMovies', () => {
        it('should return popular movies', async () => {
            const mockResults = [{ id: 1, title: 'Popular Movie' }];
            vi.mocked(moviesService.getPopularMovies).mockResolvedValue(mockResults);

            await mediaController.getPopularMovies(req, res, next);

            expect(moviesService.getPopularMovies).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });
    });
});

describe('moviesController - TV Series', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('searchSeriesByName', () => {
        it('should return TV series search results', async () => {
            const mockResults = [{ id: 1, name: 'Test Series' }];
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchSeriesByName).mockResolvedValue(mockResults);

            await mediaController.searchSeriesByName(req, res, next);

            expect(moviesService.searchSeriesByName).toHaveBeenCalledWith('Test');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should handle q parameter for TV search', async () => {
            const mockResults = [{ id: 1, name: 'Another Series' }];
            req.query = { q: 'Another' };
            vi.mocked(moviesService.searchSeriesByName).mockResolvedValue(mockResults);

            await mediaController.searchSeriesByName(req, res, next);

            expect(moviesService.searchSeriesByName).toHaveBeenCalledWith('Another');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should call next with error on failure', async () => {
            const error = new Error('TV Service error');
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchSeriesByName).mockRejectedValue(error);

            await mediaController.searchSeriesByName(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getTvDetails', () => {
        it('should return TV series details', async () => {
            const mockSeries = { id: 1, name: 'Test Series', overview: 'Test overview' };
            req.params = { id: '1' };
            vi.mocked(moviesService.getTvDetails).mockResolvedValue(mockSeries);

            await mediaController.getTvDetails(req, res, next);

            expect(moviesService.getTvDetails).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(mockSeries);
        });

        it('should call next with error on failure', async () => {
            const error = new Error('TV Details error');
            req.params = { id: '1' };
            vi.mocked(moviesService.getTvDetails).mockRejectedValue(error);

            await mediaController.getTvDetails(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getTrendingSeries', () => {
        it('should return trending TV series', async () => {
            const mockResults = [{ id: 1, name: 'Trending Series' }];
            vi.mocked(moviesService.getTrendingSeries).mockResolvedValue(mockResults);

            await mediaController.getTrendingSeries(req, res, next);

            expect(moviesService.getTrendingSeries).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should call next with error on failure', async () => {
            const error = new Error('Trending error');
            vi.mocked(moviesService.getTrendingSeries).mockRejectedValue(error);

            await mediaController.getTrendingSeries(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getPopularSeries', () => {
        it('should return popular TV series', async () => {
            const mockResults = [{ id: 1, name: 'Popular Series' }];
            vi.mocked(moviesService.getPopularSeries).mockResolvedValue(mockResults);

            await mediaController.getPopularSeries(req, res, next);

            expect(moviesService.getPopularSeries).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });
    });
});

describe('moviesController - Multi-search', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} };
        res = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        next = vi.fn();
        vi.clearAllMocks();
    });

    describe('searchMulti', () => {
        it('should return multi-search results with default type', async () => {
            const mockResults = [
                { id: 1, title: 'Movie', media_type: 'movie' },
                { id: 2, name: 'Series', media_type: 'tv' }
            ];
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchMulti).mockResolvedValue(mockResults);

            await mediaController.searchMulti(req, res, next);

            expect(moviesService.searchMulti).toHaveBeenCalledWith('Test', 'all');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should filter by type when specified', async () => {
            const mockResults = [{ id: 1, title: 'Only Movies' }];
            req.query = { q: 'Test', type: 'movie' };
            vi.mocked(moviesService.searchMulti).mockResolvedValue(mockResults);

            await mediaController.searchMulti(req, res, next);

            expect(moviesService.searchMulti).toHaveBeenCalledWith('Test', 'movie');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should search TV only when type is tv', async () => {
            const mockResults = [{ id: 1, name: 'Only Series' }];
            req.query = { name: 'Test', type: 'tv' };
            vi.mocked(moviesService.searchMulti).mockResolvedValue(mockResults);

            await mediaController.searchMulti(req, res, next);

            expect(moviesService.searchMulti).toHaveBeenCalledWith('Test', 'tv');
            expect(res.json).toHaveBeenCalledWith({ results: mockResults });
        });

        it('should call next with error on failure', async () => {
            const error = new Error('Multi-search error');
            req.query = { name: 'Test' };
            vi.mocked(moviesService.searchMulti).mockRejectedValue(error);

            await mediaController.searchMulti(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
