package com.cinema.repository;

import com.cinema.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Repository
    Set<Ticket> findByShowtime_IdAndStatusIn(Long showtimeId, Collection<String> statuses);


    Optional<Ticket> findByShowtime_IdAndSeat_Id(Long showtimeId, Long seatId);

    @Query("SELECT t FROM Ticket t JOIN t.seat s WHERE t.showtime.id = :showtimeId AND s.room.id = :roomId AND s.rowLabel = :rowLabel AND s.seatNumber = :seatNumber")
    Optional<Ticket> findByShowtimeAndSeatDetails(
            @Param("showtimeId") Long showtimeId,
            @Param("roomId") Long roomId,
            @Param("rowLabel") String rowLabel,
            @Param("seatNumber") int seatNumber
    );

    @Query("SELECT t.seat.id FROM Ticket t WHERE t.showtime.id = :showtimeId AND t.status IN :statuses")
    Set<Long> findBookedSeatIdsByShowtimeIdAndStatus(
            @Param("showtimeId") Long showtimeId,
            @Param("statuses") List<String> statuses
    );

    boolean existsByShowtime_IdAndSeat_Id(Long showtimeId, Long seatId);

    @Query(value = "SELECT t.id, CONCAT(s.row_label, s.seat_number) as seatLabel, " +
            "st.starts_at, st.ends_at, t.price, t.status " +
            "FROM tickets t " +
            "JOIN seats s ON t.seat_id = s.id " +
            "JOIN showtimes st ON t.showtime_id = st.id " +
            "WHERE (:showtimeId IS NULL OR t.showtime_id = :showtimeId) " +
            "AND (:seatId IS NULL OR t.seat_id = :seatId)",
            nativeQuery = true)
    List<Object[]> findTicketsWithDetailsNative(
            @Param("showtimeId") Long showtimeId,
            @Param("seatId") Long seatId
    );
}
