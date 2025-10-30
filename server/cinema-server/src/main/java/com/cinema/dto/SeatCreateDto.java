package com.cinema.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatCreateDto {
    @NotNull
    private Long roomId;

    private String rowLabel;

    @NotNull
    private Integer seatNumber;

    private String seatType;

    private Boolean status;
}
