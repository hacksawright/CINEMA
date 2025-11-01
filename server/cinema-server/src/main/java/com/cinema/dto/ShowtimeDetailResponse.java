package com.cinema.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;


public record ShowtimeDetailResponse(
    Long showtimeId,
    String movieTitle,
    LocalDateTime startsAt,
    
    Long roomId,
    String roomName,
    Integer totalRows,
    Integer seatsPerRow,
    BigDecimal basePrice,
    

    Set<SeatResponse> allSeats,
    
    
    Set<Long> bookedSeatIds 
) {}