package com.cinema.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class SeatDTO {
    private Long id;
    @NotBlank
    @Size(max = 10)
    private String rowLabel;
    @NotNull
    private Integer seatNumber;
    @NotBlank
    @Size(max = 30)
    private String type;
    private boolean isBooked;
}