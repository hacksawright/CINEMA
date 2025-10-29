import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import movieService from '../services/movieService';

// Query keys for consistent caching
export const movieKeys = {
  all: ['movies'],
  lists: () => [...movieKeys.all, 'list'],
  list: (filters) => [...movieKeys.lists(), { filters }],
  details: () => [...movieKeys.all, 'detail'],
  detail: (id) => [...movieKeys.details(), id],
  statistics: () => [...movieKeys.all, 'statistics'],
  counts: () => [...movieKeys.all, 'counts'],
  count: (status) => [...movieKeys.counts(), status],
};

/**
 * Hook to get all movies with pagination
 */
export const useMovies = (params = {}) => {
  return useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => movieService.getAllMovies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get all movies without pagination
 */
export const useMoviesList = () => {
  return useQuery({
    queryKey: movieKeys.lists(),
    queryFn: movieService.getAllMoviesList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get a single movie by ID
 */
export const useMovie = (id) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => movieService.getMovieById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to search movies by title
 */
export const useSearchMoviesByTitle = (title) => {
  return useQuery({
    queryKey: movieKeys.list({ search: 'title', title }),
    queryFn: () => movieService.searchMoviesByTitle(title),
    enabled: !!title && title.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get movies by genre
 */
export const useMoviesByGenre = (genre) => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'genre', genre }),
    queryFn: () => movieService.getMoviesByGenre(genre),
    enabled: !!genre,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get movies by status
 */
export const useMoviesByStatus = (status) => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'status', status }),
    queryFn: () => movieService.getMoviesByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get showing movies
 */
export const useShowingMovies = () => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'showing' }),
    queryFn: movieService.getShowingMovies,
    staleTime: 2 * 60 * 1000, // 2 minutes for showing movies
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get upcoming movies
 */
export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'upcoming' }),
    queryFn: movieService.getUpcomingMovies,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get movies by release date range
 */
export const useMoviesByReleaseDateRange = (startDate, endDate) => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'releaseDate', startDate, endDate }),
    queryFn: () => movieService.getMoviesByReleaseDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get movies by duration range
 */
export const useMoviesByDurationRange = (minDuration, maxDuration) => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'duration', minDuration, maxDuration }),
    queryFn: () => movieService.getMoviesByDurationRange(minDuration, maxDuration),
    enabled: minDuration !== undefined || maxDuration !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get movies by rating
 */
export const useMoviesByRating = (rating) => {
  return useQuery({
    queryKey: movieKeys.list({ filter: 'rating', rating }),
    queryFn: () => movieService.getMoviesByRating(rating),
    enabled: !!rating,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to search movies with multiple criteria
 */
export const useSearchMovies = (criteria) => {
  return useQuery({
    queryKey: movieKeys.list({ search: 'multi', ...criteria }),
    queryFn: () => movieService.searchMovies(criteria),
    enabled: Object.values(criteria).some(value => value !== undefined && value !== ''),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get movie statistics
 */
export const useMovieStatistics = () => {
  return useQuery({
    queryKey: movieKeys.statistics(),
    queryFn: movieService.getMovieStatistics,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to count movies by status
 */
export const useMovieCount = (status) => {
  return useQuery({
    queryKey: movieKeys.count(status),
    queryFn: () => movieService.countMoviesByStatus(status),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to check if movie exists by title
 */
export const useMovieExists = (title) => {
  return useQuery({
    queryKey: [...movieKeys.all, 'exists', title],
    queryFn: () => movieService.checkMovieExists(title),
    enabled: !!title && title.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutation hooks

/**
 * Hook to create a new movie
 */
export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: movieService.createMovie,
    onSuccess: (newMovie) => {
      // Invalidate and refetch movie lists
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: movieKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: movieKeys.counts() });
      
      // Add the new movie to the cache
      queryClient.setQueryData(movieKeys.detail(newMovie.id), newMovie);
    },
    onError: (error) => {
      console.error('Failed to create movie:', error);
    },
  });
};

/**
 * Hook to update a movie
 */
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => movieService.updateMovie(id, data),
    onSuccess: (updatedMovie, { id }) => {
      // Update the specific movie in cache
      queryClient.setQueryData(movieKeys.detail(id), updatedMovie);
      
      // Invalidate lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: movieKeys.statistics() });
    },
    onError: (error) => {
      console.error('Failed to update movie:', error);
    },
  });
};

/**
 * Hook to delete a movie
 */
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: movieService.deleteMovie,
    onSuccess: (_, deletedId) => {
      // Remove the movie from cache
      queryClient.removeQueries({ queryKey: movieKeys.detail(deletedId) });
      
      // Invalidate lists to refetch without the deleted movie
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: movieKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: movieKeys.counts() });
    },
    onError: (error) => {
      console.error('Failed to delete movie:', error);
    },
  });
};

/**
 * Hook to update movie status
 */
export const useUpdateMovieStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => movieService.updateMovieStatus(id, status),
    onSuccess: (updatedMovie, { id }) => {
      // Update the specific movie in cache
      queryClient.setQueryData(movieKeys.detail(id), updatedMovie);
      
      // Invalidate lists and counts
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: movieKeys.counts() });
      queryClient.invalidateQueries({ queryKey: movieKeys.statistics() });
    },
    onError: (error) => {
      console.error('Failed to update movie status:', error);
    },
  });
};

// Utility hooks

/**
 * Hook to prefetch movie data
 */
export const usePrefetchMovie = () => {
  const queryClient = useQueryClient();

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: movieKeys.detail(id),
      queryFn: () => movieService.getMovieById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

/**
 * Hook to invalidate all movie queries
 */
export const useInvalidateMovies = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: movieKeys.all });
  };
};
