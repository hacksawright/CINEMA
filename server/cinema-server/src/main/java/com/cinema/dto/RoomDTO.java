package com.cinema.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Data
public class RoomDTO {
    private Long id;

    @NotBlank(message = "Tên phòng không được để trống")
    @Size(max = 100, message = "Tên phòng không quá 100 ký tự")
    private String name;

    @NotNull(message = "Số hàng ghế không được để trống")
    @Positive(message = "Số hàng ghế phải là số dương")
    private Integer totalRows;

    @NotNull(message = "Số ghế mỗi hàng không được để trống")
    @Positive(message = "Số ghế mỗi hàng phải là số dương")
    private Integer seatsPerRow;
}