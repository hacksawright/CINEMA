package com.cinema.repository;

import com.cinema.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie JOIN FETCH s.room WHERE s.id = :id")
    Optional<Showtime> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie m JOIN FETCH s.room WHERE m.id = :movieId")
    List<Showtime> findByMovieId(@Param("movieId") Long movieId);
}
