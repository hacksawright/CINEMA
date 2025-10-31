package com.cinema.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.cinema.model.Showtime; // Import Entity để ánh xạ

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeResponse {
    
    
    private Long id; 
    
   
    private Long movieId; 
    private Long roomId; 
    
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private BigDecimal basePrice;
    

    public static ShowtimeResponse fromEntity(Showtime showtime) {
        return ShowtimeResponse.builder()
                .id(showtime.getId())
                // Lấy ID khóa ngoại từ Entity
                .movieId(showtime.getMovie() != null ? showtime.getMovie().getId() : null) 
                .roomId(showtime.getRoom() != null ? showtime.getRoom().getId() : null)
                .startsAt(showtime.getStartsAt())
                .endsAt(showtime.getEndsAt())
                .basePrice(showtime.getBasePrice())
                .build();
    }
}