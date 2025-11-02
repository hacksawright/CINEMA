package com.cinema.controller;

import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;
import com.cinema.dto.ShowtimeSeatInfoDTO;
import com.cinema.service.BookingService;
import com.cinema.service.ShowtimeSeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081") 
public class BookingController {

    private final ShowtimeSeatService showtimeService;
    private final BookingService bookingService;

    @GetMapping("/showtime/{showtimeId}/seats")
    public ResponseEntity<ShowtimeSeatInfoDTO> getShowtimeSeatInfo(@PathVariable Long showtimeId) {
        return ResponseEntity.ok(showtimeService.getShowtimeSeatInfo(showtimeId));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO bookingRequest) {
        Long userId = bookingRequest.getUserId();
        BookingResponseDTO response = bookingService.createBooking(userId, bookingRequest);
        return ResponseEntity.ok(response);
    }
}