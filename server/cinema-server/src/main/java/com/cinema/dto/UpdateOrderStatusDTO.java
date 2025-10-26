package com.cinema.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateOrderStatusDTO {
    @NotBlank(message = "Trạng thái mới không được để trống")
    private String newStatus;
}