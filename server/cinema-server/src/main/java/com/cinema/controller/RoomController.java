package com.cinema.controller;

import com.cinema.dto.RoomCreateDto;
import com.cinema.model.Room;
import com.cinema.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room create(@RequestBody @Valid RoomCreateDto dto) {
        return roomService.create(dto);
    }
}
