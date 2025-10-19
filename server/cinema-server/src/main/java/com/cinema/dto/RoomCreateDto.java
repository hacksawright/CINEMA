package com.cinema.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCreateDto {
    @NotBlank
    private String name;
    @NotNull
    private Integer capacity;
}
