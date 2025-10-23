package com.cinema.repository;

import com.cinema.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    // Tìm phim theo trạng thái
    List<Movie> findByStatus(String status);
    
    // Tìm phim theo tên (không phân biệt hoa thường)
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    // Tìm phim theo thể loại
    List<Movie> findByGenre(String genre);
    
    // Tìm phim theo rating
    List<Movie> findByRating(String rating);
    
    // Tìm phim theo trạng thái và thể loại
    List<Movie> findByStatusAndGenre(String status, String genre);
    
    // Tìm phim theo tên và trạng thái
    List<Movie> findByTitleContainingIgnoreCaseAndStatus(String title, String status);
    
    // Tìm phim đang chiếu
    @Query("SELECT m FROM Movie m WHERE m.status = 'showing' ORDER BY m.releaseDate DESC")
    List<Movie> findShowingMovies();
    
    // Tìm phim sắp chiếu
    @Query("SELECT m FROM Movie m WHERE m.status = 'upcoming' ORDER BY m.releaseDate ASC")
    List<Movie> findUpcomingMovies();
    
    // Tìm phim theo khoảng thời gian phát hành
    @Query("SELECT m FROM Movie m WHERE m.releaseDate BETWEEN :startDate AND :endDate ORDER BY m.releaseDate ASC")
    List<Movie> findByReleaseDateBetween(@Param("startDate") java.time.LocalDate startDate, 
                                        @Param("endDate") java.time.LocalDate endDate);
    
    // Đếm số phim theo trạng thái
    long countByStatus(String status);
    
    // Tìm phim có thời lượng lớn hơn
    List<Movie> findByDurationMinutesGreaterThan(Integer duration);
    
    // Tìm phim có thời lượng trong khoảng
    List<Movie> findByDurationMinutesBetween(Integer minDuration, Integer maxDuration);
    
    // Tìm phim theo tên chính xác (không phân biệt hoa thường)
    Movie findByTitleIgnoreCase(String title);
    
    // Kiểm tra phim có tồn tại theo tên không
    boolean existsByTitleIgnoreCase(String title);
}
