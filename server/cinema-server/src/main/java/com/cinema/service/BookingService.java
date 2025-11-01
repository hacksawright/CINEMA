package com.cinema.service;

import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;

public interface BookingService {
    
    
    BookingResponseDTO createBooking(BookingRequestDTO request);
    
}