package com.cinema.controller;

import com.cinema.dto.RoomDTO;
import com.cinema.model.Room;
import com.cinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room create(@RequestBody RoomDTO dto) {
        return roomService.create(dto);
    }

    @GetMapping
    public List<Room> getAll() {
        return roomService.findAll();
    }
}
