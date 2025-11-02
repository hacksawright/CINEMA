package com.cinema.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCreateDto {
    @NotNull
    private Long showtimeId;

    @NotNull
    private Long seatId;

    @NotNull
    private BigDecimal price;

    private String status; // optional, defaults to AVAILABLE in DB
}