package com.cinema.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeSeatInfoDTO {

    // === THÔNG TIN SUẤT CHIẾU ===
    private Long showtimeId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal pricePerSeat;

    // === THÔNG TIN PHÒNG CHIẾU ===
    private Long roomId;
    private String roomName;
    private Integer totalRows;
    private Integer seatsPerRow;

    // === THÔNG TIN GHẾ ===
    private List<SeatDTO> allSeats;
    
    private List<String> bookedSeatIds;   
}