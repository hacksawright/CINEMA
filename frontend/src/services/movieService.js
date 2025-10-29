import { api } from './api.js';

/**
 * Movie Service API Client
 * Provides methods to interact with the Movie Management API
 */

// Movie status constants
export const MOVIE_STATUS = {
  SHOWING: 'showing',
  UPCOMING: 'upcoming',
  ENDED: 'ended'
};

// Movie rating constants
export const MOVIE_RATING = {
  G: 'G',
  PG: 'PG',
  PG13: 'PG-13',
  R: 'R',
  NC17: 'NC-17'
};

/**
 * Create a new movie
 * @param {Object} movieData - Movie data
 * @param {string} movieData.title - Movie title
 * @param {string} movieData.description - Movie description
 * @param {number} movieData.durationMinutes - Duration in minutes
 * @param {string} movieData.genre - Movie genre
 * @param {string} movieData.rating - Movie rating
 * @param {string} movieData.releaseDate - Release date (YYYY-MM-DD)
 * @param {string} movieData.posterUrl - Poster image URL
 * @param {string} movieData.status - Movie status
 * @returns {Promise<Object>} Created movie data
 */
export const createMovie = async (movieData) => {
  const response = await api.post('/movies', movieData);
  return response.data;
};

/**
 * Update an existing movie
 * @param {number} id - Movie ID
 * @param {Object} movieData - Updated movie data
 * @returns {Promise<Object>} Updated movie data
 */
export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/movies/${id}`, movieData);
  return response.data;
};

/**
 * Delete a movie
 * @param {number} id - Movie ID
 * @returns {Promise<void>}
 */
export const deleteMovie = async (id) => {
  await api.delete(`/movies/${id}`);
};

/**
 * Get movie by ID
 * @param {number} id - Movie ID
 * @returns {Promise<Object>} Movie data
 */
export const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

/**
 * Get all movies with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-based)
 * @param {number} params.size - Page size
 * @param {string} params.sort - Sort field
 * @param {string} params.direction - Sort direction (asc/desc)
 * @returns {Promise<Object>} Paginated movies data
 */
export const getAllMovies = async (params = {}) => {
  const response = await api.get('/movies', { params });
  return response.data;
};

/**
 * Get all movies without pagination
 * @returns {Promise<Array>} Array of movies
 */
export const getAllMoviesList = async () => {
  const response = await api.get('/movies/all');
  return response.data;
};

/**
 * Search movies by title
 * @param {string} title - Search title
 * @returns {Promise<Array>} Array of matching movies
 */
export const searchMoviesByTitle = async (title) => {
  const response = await api.get('/movies/search/title', {
    params: { title }
  });
  return response.data;
};

/**
 * Get movies by genre
 * @param {string} genre - Movie genre
 * @returns {Promise<Array>} Array of movies
 */
export const getMoviesByGenre = async (genre) => {
  const response = await api.get(`/movies/genre/${encodeURIComponent(genre)}`);
  return response.data;
};

/**
 * Get movies by status
 * @param {string} status - Movie status
 * @returns {Promise<Array>} Array of movies
 */
export const getMoviesByStatus = async (status) => {
  const response = await api.get(`/movies/status/${status}`);
  return response.data;
};

/**
 * Get movies currently showing
 * @returns {Promise<Array>} Array of showing movies
 */
export const getShowingMovies = async () => {
  const response = await api.get('/movies/showing');
  return response.data;
};

/**
 * Get upcoming movies
 * @returns {Promise<Array>} Array of upcoming movies
 */
export const getUpcomingMovies = async () => {
  const response = await api.get('/movies/upcoming');
  return response.data;
};

/**
 * Get movies by release date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of movies
 */
export const getMoviesByReleaseDateRange = async (startDate, endDate) => {
  const response = await api.get('/movies/release-date', {
    params: { startDate, endDate }
  });
  return response.data;
};

/**
 * Get movies by duration range
 * @param {number} minDuration - Minimum duration in minutes
 * @param {number} maxDuration - Maximum duration in minutes
 * @returns {Promise<Array>} Array of movies
 */
export const getMoviesByDurationRange = async (minDuration, maxDuration) => {
  const params = {};
  if (minDuration !== undefined) params.minDuration = minDuration;
  if (maxDuration !== undefined) params.maxDuration = maxDuration;
  
  const response = await api.get('/movies/duration', { params });
  return response.data;
};

/**
 * Get movies by rating
 * @param {string} rating - Movie rating
 * @returns {Promise<Array>} Array of movies
 */
export const getMoviesByRating = async (rating) => {
  const response = await api.get(`/movies/rating/${rating}`);
  return response.data;
};

/**
 * Search movies with multiple criteria
 * @param {Object} criteria - Search criteria
 * @param {string} criteria.title - Movie title
 * @param {string} criteria.genre - Movie genre
 * @param {string} criteria.status - Movie status
 * @param {string} criteria.rating - Movie rating
 * @returns {Promise<Array>} Array of matching movies
 */
export const searchMovies = async (criteria = {}) => {
  const params = {};
  if (criteria.title) params.title = criteria.title;
  if (criteria.genre) params.genre = criteria.genre;
  if (criteria.status) params.status = criteria.status;
  if (criteria.rating) params.rating = criteria.rating;
  
  const response = await api.get('/movies/search', { params });
  return response.data;
};

/**
 * Update movie status
 * @param {number} id - Movie ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated movie data
 */
export const updateMovieStatus = async (id, status) => {
  const response = await api.patch(`/movies/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

/**
 * Check if movie exists by title
 * @param {string} title - Movie title
 * @returns {Promise<boolean>} True if movie exists
 */
export const checkMovieExists = async (title) => {
  const response = await api.get('/movies/exists', {
    params: { title }
  });
  return response.data;
};

/**
 * Count movies by status
 * @param {string} status - Movie status (optional)
 * @returns {Promise<number>} Count of movies
 */
export const countMoviesByStatus = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/movies/count', { params });
  return response.data;
};

/**
 * Get movie statistics
 * @returns {Promise<Object>} Movie statistics
 */
export const getMovieStatistics = async () => {
  const response = await api.get('/movies/statistics');
  return response.data;
};

// Export all functions as default object
export default {
  // Constants
  MOVIE_STATUS,
  MOVIE_RATING,
  
  // CRUD operations
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getAllMovies,
  getAllMoviesList,
  
  // Search and filter
  searchMoviesByTitle,
  getMoviesByGenre,
  getMoviesByStatus,
  getShowingMovies,
  getUpcomingMovies,
  getMoviesByReleaseDateRange,
  getMoviesByDurationRange,
  getMoviesByRating,
  searchMovies,
  
  // Status management
  updateMovieStatus,
  
  // Utility functions
  checkMovieExists,
  countMoviesByStatus,
  getMovieStatistics
};

