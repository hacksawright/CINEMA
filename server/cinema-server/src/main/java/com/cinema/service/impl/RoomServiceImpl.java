package com.cinema.service.impl;

import com.cinema.dto.RoomDTO;
import com.cinema.model.Room;
import com.cinema.repository.RoomRepository;
import com.cinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public Room create(RoomDTO dto) {
        Room room = Room.builder()
                .name(dto.getName())
                .totalRows(dto.getTotalRows())
                .seatsPerRow(dto.getSeatsPerRow())
                .build();
        return roomRepository.save(room);
    }

    @Override
    public List<Room> findAll() {
        return roomRepository.findAll();
    }
}
