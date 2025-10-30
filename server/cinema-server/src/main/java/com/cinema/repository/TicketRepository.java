package com.cinema.repository;

import com.cinema.dto.TicketResponseDto;
import com.cinema.model.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByShowtimeIdAndSeatId(Long showtimeId, Long seatId);

    @Query(value = """
    SELECT 
        t.id AS ticketId,
        CONCAT(s.row_label, s.seat_number) AS seatLabel,
        sh.starts_at AS startsAt,
        sh.ends_at AS endsAt,
        t.price AS price,
        t.status AS status
    FROM tickets t
    JOIN seats s ON t.seat_id = s.id
    JOIN showtimes sh ON t.showtime_id = sh.id
    WHERE (:showtimeId IS NULL OR t.showtime_id = :showtimeId)
      AND (:seatId IS NULL OR t.seat_id = :seatId)
""", nativeQuery = true)
List<Object[]> findTicketsWithDetailsNative(
        @Param("showtimeId") Long showtimeId,
        @Param("seatId") Long seatId
);

}

