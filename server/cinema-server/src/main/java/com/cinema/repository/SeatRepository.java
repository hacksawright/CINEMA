package com.cinema.repository;

import com.cinema.entity.Seat;
import com.cinema.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByRoomId(Long roomId);
    Optional<Seat> findByRoomIdAndRowLabelAndSeatNumber(Long roomId, String rowLabel, int seatNumber);
    void deleteByRoomId(Long roomId);
}