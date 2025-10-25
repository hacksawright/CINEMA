package com.cinema.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long bookingId;
    private String ticketCode;
    private String status;
    private List<String> seats;
    private BigDecimal totalAmount;
}