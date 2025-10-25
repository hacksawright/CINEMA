package com.cinema.service;

import com.cinema.model.Room;
import com.cinema.dto.RoomCreateDto;
import java.util.List;

public interface RoomService {
    Room create(RoomCreateDto dto);
    List<Room> findAll();
}
