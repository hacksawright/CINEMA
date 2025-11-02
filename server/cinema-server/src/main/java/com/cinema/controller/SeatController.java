package com.cinema.controller;

import com.cinema.dto.SeatCreateDto;
import com.cinema.model.Seat;
import com.cinema.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Seat create(@RequestBody @Valid SeatCreateDto dto) {
        return seatService.create(dto);
    }
}