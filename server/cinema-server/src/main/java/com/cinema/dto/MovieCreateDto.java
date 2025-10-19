package com.cinema.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieCreateDto {
    @NotBlank
    private String title;
    private String description;
    private Integer durationMinutes;
    private String rating;
    private LocalDate releaseDate;
}
