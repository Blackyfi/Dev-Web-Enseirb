import * as mediaService from '../services/moviesService.js';

// Search movies by name
export async function searchMoviesByName(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }
  try {
    const movies = await mediaService.searchMoviesByName(name);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Unable to search movies by name' });
  }
}
