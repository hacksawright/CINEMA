package com.cinema.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeDto {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    private Long movieId;
    private Long roomId;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private BigDecimal basePrice;
}
