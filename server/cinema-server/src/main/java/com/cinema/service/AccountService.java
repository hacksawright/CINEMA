package com.cinema.service;

import com.cinema.dto.BookingDetailResponse;
import com.cinema.dto.UserProfileDTO;

import java.util.List;

public interface AccountService {
    
    UserProfileDTO getUserProfile(Long userId);

    List<BookingDetailResponse> getUserBookings(Long userId);

    void cancelBooking(Long bookingId, Long userId);
}
