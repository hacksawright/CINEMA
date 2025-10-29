package com.cinema.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
public class OrderSummaryDTO {
    private Long id;
    private String ticketCode;
    private String customerName;
    private String customerPhone;
    private String movieTitle;
    private LocalDateTime showtimeStartsAt;
    private String roomName;
    private List<String> seatLabels;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime orderDate;
}