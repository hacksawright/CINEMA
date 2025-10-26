package com.cinema.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class RoomLayoutDTO {
    @NotNull
    private Long roomId;
    private String roomName;
    @NotNull
    private Integer totalRows;
    @NotNull
    private Integer seatsPerRow;
    @NotEmpty
    @Valid
    private List<SeatDTO> seats;
}