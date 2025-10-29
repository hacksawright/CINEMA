package com.cinema.controller;

import com.cinema.dto.MovieRequest;
import com.cinema.dto.MovieResponse;
import com.cinema.service.MovieService;
import com.cinema.service.MovieStatistics;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller cho quản lý phim
 * Cung cấp các API endpoints để thực hiện các thao tác CRUD và tìm kiếm phim
 */
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private static final Logger logger = LoggerFactory.getLogger(MovieController.class);

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * Tạo phim mới
     */
    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieRequest movieRequest) {
        logger.info("API: Tạo phim mới - {}", movieRequest.getTitle());
        MovieResponse response = movieService.createMovie(movieRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật thông tin phim
     */
    @PutMapping("/{id}")
    public ResponseEntity<MovieResponse> updateMovie(
            @PathVariable Long id, 
            @Valid @RequestBody MovieRequest movieRequest) {
        logger.info("API: Cập nhật phim ID: {}", id);
        MovieResponse response = movieService.updateMovie(id, movieRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa phim
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        logger.info("API: Xóa phim ID: {}", id);
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin phim theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        logger.debug("API: Lấy thông tin phim ID: {}", id);
        MovieResponse response = movieService.getMovieById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả phim với phân trang
     */
    @GetMapping
    public ResponseEntity<Page<MovieResponse>> getAllMovies(Pageable pageable) {
        logger.debug("API: Lấy danh sách phim với phân trang");
        Page<MovieResponse> response = movieService.getAllMovies(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả phim (không phân trang)
     */
    @GetMapping("/all")
    public ResponseEntity<List<MovieResponse>> getAllMoviesList() {
        logger.debug("API: Lấy tất cả phim");
        List<MovieResponse> response = movieService.getAllMovies();
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm phim theo tên
     */
    @GetMapping("/search/title")
    public ResponseEntity<List<MovieResponse>> searchMoviesByTitle(@RequestParam String title) {
        logger.debug("API: Tìm kiếm phim theo tên: {}", title);
        List<MovieResponse> response = movieService.searchMoviesByTitle(title);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy phim theo thể loại
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MovieResponse>> getMoviesByGenre(@PathVariable String genre) {
        logger.debug("API: Lấy phim theo thể loại: {}", genre);
        List<MovieResponse> response = movieService.getMoviesByGenre(genre);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy phim theo trạng thái
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MovieResponse>> getMoviesByStatus(@PathVariable String status) {
        logger.debug("API: Lấy phim theo trạng thái: {}", status);
        List<MovieResponse> response = movieService.getMoviesByStatus(status);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách phim đang chiếu
     */
    @GetMapping("/showing")
    public ResponseEntity<List<MovieResponse>> getShowingMovies() {
        logger.debug("API: Lấy danh sách phim đang chiếu");
        List<MovieResponse> response = movieService.getShowingMovies();
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách phim sắp chiếu
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<MovieResponse>> getUpcomingMovies() {
        logger.debug("API: Lấy danh sách phim sắp chiếu");
        List<MovieResponse> response = movieService.getUpcomingMovies();
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm phim theo khoảng thời gian phát hành
     */
    @GetMapping("/release-date")
    public ResponseEntity<List<MovieResponse>> getMoviesByReleaseDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        logger.debug("API: Tìm kiếm phim theo khoảng thời gian: {} - {}", startDate, endDate);
        List<MovieResponse> response = movieService.getMoviesByReleaseDateRange(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm phim theo thời lượng
     */
    @GetMapping("/duration")
    public ResponseEntity<List<MovieResponse>> getMoviesByDurationRange(
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration) {
        logger.debug("API: Tìm kiếm phim theo thời lượng: {} - {}", minDuration, maxDuration);
        List<MovieResponse> response = movieService.getMoviesByDurationRange(minDuration, maxDuration);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy phim theo rating
     */
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<MovieResponse>> getMoviesByRating(@PathVariable String rating) {
        logger.debug("API: Lấy phim theo rating: {}", rating);
        List<MovieResponse> response = movieService.getMoviesByRating(rating);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm phim theo nhiều tiêu chí
     */
    @GetMapping("/search")
    public ResponseEntity<List<MovieResponse>> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String rating) {
        logger.debug("API: Tìm kiếm phim với các tiêu chí - Title: {}, Genre: {}, Status: {}, Rating: {}", 
                    title, genre, status, rating);
        List<MovieResponse> response = movieService.searchMovies(title, genre, status, rating);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật trạng thái phim
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<MovieResponse> updateMovieStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        logger.info("API: Cập nhật trạng thái phim ID: {} thành: {}", id, status);
        MovieResponse response = movieService.updateMovieStatus(id, status);
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra phim có tồn tại theo tên không
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkMovieExists(@RequestParam String title) {
        logger.debug("API: Kiểm tra phim có tồn tại: {}", title);
        boolean exists = movieService.existsByTitle(title);
        return ResponseEntity.ok(exists);
    }

    /**
     * Đếm số phim theo trạng thái
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countMoviesByStatus(@RequestParam(required = false) String status) {
        logger.debug("API: Đếm số phim theo trạng thái: {}", status);
        long count = movieService.countMoviesByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Lấy thống kê phim
     */
    @GetMapping("/statistics")
    public ResponseEntity<MovieStatistics> getMovieStatistics() {
        logger.debug("API: Lấy thống kê phim");
        MovieStatistics statistics = movieService.getMovieStatistics();
        return ResponseEntity.ok(statistics);
    }
}
