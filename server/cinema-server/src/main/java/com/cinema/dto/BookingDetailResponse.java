package com.cinema.dto;

import java.math.BigDecimal;
import java.util.List;

public record BookingDetailResponse(
    Long id,
    String ticketCode,
    BigDecimal totalAmount,
    String status,
    
    
    ShowtimeInfo showtime,
    
    
    List<String> seats
) {
    public record ShowtimeInfo(
        Long showtimeId,
        String movieTitle,
        String showTime, 
        String showDate  
    ) {}
}