package com.cinema.service.impl;

import com.cinema.dto.SeatCreateDto;
import com.cinema.model.Room;
import com.cinema.model.Seat;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SeatServiceImpl implements SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Seat create(SeatCreateDto dto) {
        Optional<Room> roomOpt = roomRepository.findById(dto.getRoomId());
        if (!roomOpt.isPresent()) {
            throw new IllegalArgumentException("Room not found with id=" + dto.getRoomId());
        }
        Room room = roomOpt.get();

        Seat seat = new Seat();
        seat.setRoom(room);
        seat.setRowLabel(dto.getRowLabel());
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setType(dto.getSeatType() != null ? dto.getSeatType() : "STANDARD");

        return seatRepository.save(seat);
    }
}