package com.cinema.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class BookingRequestDTO {
    @NotNull
    private Long showtimeId;
    @NotEmpty
    private List<String> selectedSeats;
    @NotBlank
    private String paymentMethod;
}