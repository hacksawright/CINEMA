package com.cinema.repository;

import com.cinema.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Set;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // SỬA: Đảm bảo tham số thứ hai là Long, không phải Object
    List<Ticket> findByShowtimeIdAndSeatId(Long showtimeId, Long seatId); 
    
    // Hoặc sử dụng mối quan hệ trực tiếp (tốt hơn):
    List<Ticket> findByShowtime_IdAndSeat_Id(Long showtimeId, Long seatId);
    Set<Ticket> findByShowtime_IdAndStatusIn(Long showtimeId, List<String> statuses);
}