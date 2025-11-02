
package com.cinema.dto;

import lombok.Builder;

@Builder
public record SeatInfoDTO(
    Long id,
    String rowLabel,
    Integer seatNumber,
    String type,
    boolean isBooked 
) {}