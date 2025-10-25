package com.cinema.repository;

import com.cinema.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.seats WHERE r.id = :roomId")
    Optional<Room> findByIdWithSeats(@Param("roomId") Long roomId);
}