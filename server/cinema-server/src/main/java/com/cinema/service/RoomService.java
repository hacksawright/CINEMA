package com.cinema.service;

import com.cinema.model.Room;
import com.cinema.dto.RoomCreateDto;

public interface RoomService {
    Room create(RoomCreateDto dto);
}
