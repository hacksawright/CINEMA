package com.cinema.service;

import com.cinema.dto.SeatCreateDto;
import com.cinema.model.Seat;

public interface SeatService {
    Seat create(SeatCreateDto dto);
}