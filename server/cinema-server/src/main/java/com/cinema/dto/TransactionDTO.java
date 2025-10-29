package com.cinema.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private Long orderId;
    private String ticketCode;
    private String customerName;
    private String movieTitle;
    private LocalDateTime showtimeStartsAt;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private LocalDateTime transactionDate;
    private LocalDateTime paidAt;
}