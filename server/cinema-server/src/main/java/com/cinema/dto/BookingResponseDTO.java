package com.cinema.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponseDTO {
   public BookingResponseDTO(Long id, BigDecimal totalAmount2) {
    }
   private Long orderId;
   private Long bookingId;
   private String ticketCode;
   private String status;
   private List<String> seats;
   private BigDecimal totalAmount;
}