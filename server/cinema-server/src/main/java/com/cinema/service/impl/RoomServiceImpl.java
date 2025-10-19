package com.cinema.service.impl;

import com.cinema.dto.RoomCreateDto;
import com.cinema.model.Room;
import com.cinema.repository.RoomRepository;
import com.cinema.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Room create(RoomCreateDto dto) {
        Room r = Room.builder()
                .name(dto.getName())
                .capacity(dto.getCapacity())
                .build();
        return roomRepository.save(r);
    }
}
