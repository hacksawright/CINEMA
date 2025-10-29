package com.cinema.dto;

import lombok.Data;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShowtimeSeatInfoDTO {
    private Long showtimeId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal pricePerSeat;
    private Integer totalRows;
    private Integer seatsPerRow;
    private List<SeatDTO> allSeats;
    private List<String> bookedSeatIds;
}