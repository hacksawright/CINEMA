package com.cinema.service;

import com.cinema.dto.MovieRequest;
import com.cinema.dto.MovieResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface cho quản lý phim
 * Cung cấp các phương thức để thực hiện các thao tác CRUD và tìm kiếm phim
 */
public interface MovieService {

    /**
     * Tạo phim mới
     * @param movieRequest thông tin phim cần tạo
     * @return thông tin phim đã được tạo
     * @throws IllegalArgumentException nếu tên phim đã tồn tại
     */
    MovieResponse createMovie(MovieRequest movieRequest);

    /**
     * Cập nhật thông tin phim
     * @param id ID của phim cần cập nhật
     * @param movieRequest thông tin mới của phim
     * @return thông tin phim đã được cập nhật
     * @throws RuntimeException nếu không tìm thấy phim
     */
    MovieResponse updateMovie(Long id, MovieRequest movieRequest);

    /**
     * Xóa phim
     * @param id ID của phim cần xóa
     * @throws RuntimeException nếu không tìm thấy phim
     */
    void deleteMovie(Long id);

    /**
     * Lấy thông tin phim theo ID
     * @param id ID của phim
     * @return thông tin phim
     * @throws RuntimeException nếu không tìm thấy phim
     */
    MovieResponse getMovieById(Long id);

    /**
     * Lấy tất cả phim với phân trang
     * @param pageable thông tin phân trang
     * @return danh sách phim với phân trang
     */
    Page<MovieResponse> getAllMovies(Pageable pageable);

    /**
     * Lấy tất cả phim
     * @return danh sách tất cả phim
     */
    List<MovieResponse> getAllMovies();

    /**
     * Tìm kiếm phim theo tên
     * @param title tên phim (không phân biệt hoa thường)
     * @return danh sách phim tìm được
     */
    List<MovieResponse> searchMoviesByTitle(String title);

    /**
     * Tìm kiếm phim theo thể loại
     * @param genre thể loại phim
     * @return danh sách phim theo thể loại
     */
    List<MovieResponse> getMoviesByGenre(String genre);

    /**
     * Tìm kiếm phim theo trạng thái
     * @param status trạng thái phim (showing, upcoming, ended)
     * @return danh sách phim theo trạng thái
     */
    List<MovieResponse> getMoviesByStatus(String status);

    /**
     * Lấy danh sách phim đang chiếu
     * @return danh sách phim đang chiếu
     */
    List<MovieResponse> getShowingMovies();

    /**
     * Lấy danh sách phim sắp chiếu
     * @return danh sách phim sắp chiếu
     */
    List<MovieResponse> getUpcomingMovies();

    /**
     * Tìm kiếm phim theo khoảng thời gian phát hành
     * @param startDate ngày bắt đầu
     * @param endDate ngày kết thúc
     * @return danh sách phim trong khoảng thời gian
     */
    List<MovieResponse> getMoviesByReleaseDateRange(LocalDate startDate, LocalDate endDate);

    /**
     * Tìm kiếm phim theo thời lượng
     * @param minDuration thời lượng tối thiểu (phút)
     * @param maxDuration thời lượng tối đa (phút)
     * @return danh sách phim theo thời lượng
     */
    List<MovieResponse> getMoviesByDurationRange(Integer minDuration, Integer maxDuration);

    /**
     * Tìm kiếm phim theo rating
     * @param rating rating của phim
     * @return danh sách phim theo rating
     */
    List<MovieResponse> getMoviesByRating(String rating);

    /**
     * Tìm kiếm phim theo nhiều tiêu chí
     * @param title tên phim (có thể null)
     * @param genre thể loại (có thể null)
     * @param status trạng thái (có thể null)
     * @param rating rating (có thể null)
     * @return danh sách phim thỏa mãn các tiêu chí
     */
    List<MovieResponse> searchMovies(String title, String genre, String status, String rating);

    /**
     * Cập nhật trạng thái phim
     * @param id ID của phim
     * @param status trạng thái mới
     * @return thông tin phim đã được cập nhật
     * @throws RuntimeException nếu không tìm thấy phim hoặc trạng thái không hợp lệ
     */
    MovieResponse updateMovieStatus(Long id, String status);

    /**
     * Kiểm tra phim có tồn tại theo tên không
     * @param title tên phim
     * @return true nếu phim tồn tại, false nếu không
     */
    boolean existsByTitle(String title);

    /**
     * Đếm số phim theo trạng thái
     * @param status trạng thái phim
     * @return số lượng phim
     */
    long countMoviesByStatus(String status);

    /**
     * Lấy thống kê phim
     * @return thông tin thống kê về phim
     */
    MovieStatistics getMovieStatistics();
}
