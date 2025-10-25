package com.cinema.repository;

import com.cinema.entity.Ticket;
import com.cinema.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByShowtimeIdAndStatusIn(Long showtimeId, List<String> statuses);
    Optional<Ticket> findByShowtimeIdAndSeatId(Long showtimeId, Long seatId);

    @Query("SELECT t FROM Ticket t JOIN t.seat s WHERE t.showtime.id = :showtimeId AND s.room.id = :roomId AND s.rowLabel = :rowLabel AND s.seatNumber = :seatNumber")
    Optional<Ticket> findByShowtimeAndSeatDetails(@Param("showtimeId") Long showtimeId, @Param("roomId") Long roomId, @Param("rowLabel") String rowLabel, @Param("seatNumber") int seatNumber);

     @Query("SELECT t.seat.id FROM Ticket t WHERE t.showtime.id = :showtimeId AND t.status IN :statuses")
     Set<Long> findBookedSeatIdsByShowtimeIdAndStatus(@Param("showtimeId") Long showtimeId, @Param("statuses") List<String> statuses);
}