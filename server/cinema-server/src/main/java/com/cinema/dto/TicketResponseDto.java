package com.cinema.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDto {
    private Long ticketId;
    private String seatLabel;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private BigDecimal price;
    private String status;
}
