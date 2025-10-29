package com.cinema.service;

import com.cinema.model.Room;
import com.cinema.dto.RoomDTO;
import java.util.List;

public interface RoomService {
    Room create(RoomDTO dto);
    List<Room> findAll();
}