package com.cinema.service;

import java.util.List;

import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;

public interface BookingService {
    BookingResponseDTO createBooking(Long userId, BookingRequestDTO request);
   
}