package com.cinema.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderDetailDTO extends OrderSummaryDTO {
    private String customerEmail;
    private List<TransactionDTO> transactions;
    private LocalDateTime paymentDate;
}