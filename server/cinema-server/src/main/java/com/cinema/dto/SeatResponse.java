
package com.cinema.dto;

import com.cinema.model.Seat; 

public record SeatResponse(
    Long id,
    String rowLabel,
    Integer seatNumber,
    String type
) {
    public static SeatResponse fromEntity(Seat seat) {
        return new SeatResponse(seat.getId(), seat.getRowLabel(), seat.getSeatNumber(), seat.getType());
    }
}