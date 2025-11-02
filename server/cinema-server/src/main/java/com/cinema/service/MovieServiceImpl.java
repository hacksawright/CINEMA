package com.cinema.service;

import com.cinema.dto.MovieRequest;
import com.cinema.dto.MovieResponse;
import com.cinema.model.Movie;
import com.cinema.exception.InvalidMovieStatusException;
import com.cinema.exception.MovieAlreadyExistsException;
import com.cinema.exception.MovieNotFoundException;
import com.cinema.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của MovieService
 * Cung cấp các phương thức để quản lý phim với đầy đủ logic nghiệp vụ
 */
@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private static final Logger logger = LoggerFactory.getLogger(MovieServiceImpl.class);
    
    // Các trạng thái hợp lệ của phim
    private static final String STATUS_SHOWING = "showing";
    private static final String STATUS_UPCOMING = "upcoming";
    private static final String STATUS_ENDED = "ended";
    
    private final MovieRepository movieRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public MovieResponse createMovie(MovieRequest movieRequest) {
        logger.info("Tạo phim mới với tên: {}", movieRequest.getTitle());
        
        // Kiểm tra phim đã tồn tại chưa
        if (movieRepository.existsByTitleIgnoreCase(movieRequest.getTitle())) {
            throw MovieAlreadyExistsException.withTitle(movieRequest.getTitle());
        }
        
        // Validate trạng thái
        validateMovieStatus(movieRequest.getStatus());
        
        // Tạo entity từ request
        Movie movie = new Movie(
                movieRequest.getTitle(),
                movieRequest.getDescription(),
                movieRequest.getDurationMinutes(),
                movieRequest.getRating(),
                movieRequest.getReleaseDate(),
                movieRequest.getGenre(),
                movieRequest.getPosterUrl(),
                movieRequest.getStatus()
        );
        
        // Lưu vào database
        Movie savedMovie = movieRepository.save(movie);
        logger.info("Đã tạo phim thành công với ID: {}", savedMovie.getId());
        
        return MovieResponse.fromEntity(savedMovie);
    }

    @Override
    public MovieResponse updateMovie(Long id, MovieRequest movieRequest) {
        logger.info("Cập nhật phim với ID: {}", id);
        
        // Tìm phim theo ID
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        
        // Kiểm tra tên phim có thay đổi không và có bị trùng không
        if (!existingMovie.getTitle().equalsIgnoreCase(movieRequest.getTitle()) &&
            movieRepository.existsByTitleIgnoreCase(movieRequest.getTitle())) {
            throw MovieAlreadyExistsException.withTitle(movieRequest.getTitle());
        }
        
        // Validate trạng thái
        validateMovieStatus(movieRequest.getStatus());
        
        // Cập nhật thông tin
        existingMovie.setTitle(movieRequest.getTitle());
        existingMovie.setDescription(movieRequest.getDescription());
        existingMovie.setDurationMinutes(movieRequest.getDurationMinutes());
        existingMovie.setRating(movieRequest.getRating());
        existingMovie.setReleaseDate(movieRequest.getReleaseDate());
        existingMovie.setGenre(movieRequest.getGenre());
        existingMovie.setPosterUrl(movieRequest.getPosterUrl());
        existingMovie.setStatus(movieRequest.getStatus());
        
        // Lưu thay đổi
        Movie updatedMovie = movieRepository.save(existingMovie);
        logger.info("Đã cập nhật phim thành công với ID: {}", updatedMovie.getId());
        
        return MovieResponse.fromEntity(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        logger.info("Xóa phim với ID: {}", id);
        
        // Kiểm tra phim có tồn tại không
        if (!movieRepository.existsById(id)) {
            throw new MovieNotFoundException(id);
        }
        
        movieRepository.deleteById(id);
        logger.info("Đã xóa phim thành công với ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Long id) {
        logger.debug("Lấy thông tin phim với ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        
        // Force load showtimes to avoid lazy loading issues
        if (movie.getShowtimes() != null) {
            int showtimeCount = movie.getShowtimes().size();
            logger.debug("Phim ID {} có {} suất chiếu", id, showtimeCount);
        } else {
            logger.warn("Phim ID {} không có showtimes (null)", id);
        }

        MovieResponse response = MovieResponse.fromEntity(movie);
        logger.debug("MovieResponse cho phim {} có {} showtimes", 
                    id, response.getShowtimes() != null ? response.getShowtimes().size() : 0);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieResponse> getAllMovies(Pageable pageable) {
        logger.debug("Lấy danh sách phim với phân trang: {}", pageable);
        
        Page<Movie> movies = movieRepository.findAll(pageable);
        return movies.map(MovieResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getAllMovies() {
        logger.debug("Lấy tất cả phim");
        
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> searchMoviesByTitle(String title) {
        logger.debug("Tìm kiếm phim theo tên: {}", title);
        
        if (!StringUtils.hasText(title)) {
            return getAllMovies();
        }
        
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(title);
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByGenre(String genre) {
        logger.debug("Lấy phim theo thể loại: {}", genre);
        
        if (!StringUtils.hasText(genre)) {
            return getAllMovies();
        }
        
        List<Movie> movies = movieRepository.findByGenre(genre);
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByStatus(String status) {
        logger.debug("Lấy phim theo trạng thái: {}", status);
        
        if (!StringUtils.hasText(status)) {
            return getAllMovies();
        }
        
        validateMovieStatus(status);
        
        List<Movie> movies = movieRepository.findByStatus(status);
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getShowingMovies() {
        logger.debug("Lấy danh sách phim đang chiếu");
        
        List<Movie> movies = movieRepository.findShowingMovies();
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getUpcomingMovies() {
        logger.debug("Lấy danh sách phim sắp chiếu");
        
        List<Movie> movies = movieRepository.findUpcomingMovies();
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByReleaseDateRange(LocalDate startDate, LocalDate endDate) {
        logger.debug("Lấy phim theo khoảng thời gian phát hành: {} - {}", startDate, endDate);
        
        if (startDate == null || endDate == null) {
            return getAllMovies();
        }
        
        List<Movie> movies = movieRepository.findByReleaseDateBetween(startDate, endDate);
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByDurationRange(Integer minDuration, Integer maxDuration) {
        logger.debug("Lấy phim theo thời lượng: {} - {} phút", minDuration, maxDuration);
        
        if (minDuration == null && maxDuration == null) {
            return getAllMovies();
        }
        
        List<Movie> movies;
        if (minDuration != null && maxDuration != null) {
            movies = movieRepository.findByDurationMinutesBetween(minDuration, maxDuration);
        } else if (minDuration != null) {
            movies = movieRepository.findByDurationMinutesGreaterThan(minDuration);
        } else {
            // maxDuration != null
            movies = movieRepository.findByDurationMinutesBetween(0, maxDuration);
        }
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByRating(String rating) {
        logger.debug("Lấy phim theo rating: {}", rating);
        
        if (!StringUtils.hasText(rating)) {
            return getAllMovies();
        }
        
        List<Movie> movies = movieRepository.findByRating(rating);
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> searchMovies(String title, String genre, String status, String rating) {
        logger.debug("Tìm kiếm phim với các tiêu chí - Title: {}, Genre: {}, Status: {}, Rating: {}", 
                    title, genre, status, rating);
        
        List<Movie> movies;
        
        // Tìm kiếm theo nhiều tiêu chí
        if (StringUtils.hasText(title) && StringUtils.hasText(status)) {
            movies = movieRepository.findByTitleContainingIgnoreCaseAndStatus(title, status);
        } else if (StringUtils.hasText(genre) && StringUtils.hasText(status)) {
            movies = movieRepository.findByStatusAndGenre(status, genre);
        } else if (StringUtils.hasText(title)) {
            movies = movieRepository.findByTitleContainingIgnoreCase(title);
        } else if (StringUtils.hasText(genre)) {
            movies = movieRepository.findByGenre(genre);
        } else if (StringUtils.hasText(status)) {
            validateMovieStatus(status);
            movies = movieRepository.findByStatus(status);
        } else if (StringUtils.hasText(rating)) {
            movies = movieRepository.findByRating(rating);
        } else {
            movies = movieRepository.findAll();
        }
        
        // Lọc thêm theo các tiêu chí còn lại nếu cần
        if (StringUtils.hasText(genre) && !movies.isEmpty()) {
            movies = movies.stream()
                    .filter(movie -> genre.equalsIgnoreCase(movie.getGenre()))
                    .collect(Collectors.toList());
        }
        
        if (StringUtils.hasText(rating) && !movies.isEmpty()) {
            movies = movies.stream()
                    .filter(movie -> rating.equalsIgnoreCase(movie.getRating()))
                    .collect(Collectors.toList());
        }
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public MovieResponse updateMovieStatus(Long id, String status) {
        logger.info("Cập nhật trạng thái phim ID: {} thành: {}", id, status);
        
        // Validate trạng thái
        validateMovieStatus(status);
        
        // Tìm phim
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        
        // Cập nhật trạng thái
        movie.setStatus(status);
        Movie updatedMovie = movieRepository.save(movie);
        
        logger.info("Đã cập nhật trạng thái phim thành công");
        return MovieResponse.fromEntity(updatedMovie);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTitle(String title) {
        return movieRepository.existsByTitleIgnoreCase(title);
    }

    @Override
    @Transactional(readOnly = true)
    public long countMoviesByStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return movieRepository.count();
        }
        
        validateMovieStatus(status);
        return movieRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public MovieStatistics getMovieStatistics() {
        logger.debug("Lấy thống kê phim");
        
        long totalMovies = movieRepository.count();
        long showingMovies = movieRepository.countByStatus(STATUS_SHOWING);
        long upcomingMovies = movieRepository.countByStatus(STATUS_UPCOMING);
        long endedMovies = movieRepository.countByStatus(STATUS_ENDED);
        
        // Đếm số thể loại và rating duy nhất
        List<Movie> allMovies = movieRepository.findAll();
        long totalGenres = allMovies.stream()
                .map(Movie::getGenre)
                .filter(StringUtils::hasText)
                .distinct()
                .count();
        
        long totalRatings = allMovies.stream()
                .map(Movie::getRating)
                .filter(StringUtils::hasText)
                .distinct()
                .count();
        
        return new MovieStatistics(totalMovies, showingMovies, upcomingMovies, 
                                 endedMovies, totalGenres, totalRatings);
    }

    /**
     * Validate trạng thái phim
     * @param status trạng thái cần validate
     * @throws InvalidMovieStatusException nếu trạng thái không hợp lệ
     */
    private void validateMovieStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return; // Cho phép null hoặc empty
        }
        
        if (!STATUS_SHOWING.equals(status) && 
            !STATUS_UPCOMING.equals(status) && 
            !STATUS_ENDED.equals(status)) {
            throw InvalidMovieStatusException.withStatus(status);
        }
    }
}