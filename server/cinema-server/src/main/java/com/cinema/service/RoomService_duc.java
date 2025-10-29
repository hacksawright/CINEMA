package com.cinema.service;

import com.cinema.dto.RoomDTO;
import com.cinema.dto.RoomLayoutDTO;
import com.cinema.dto.SeatDTO;
import com.cinema.model.Room;
import com.cinema.model.Seat;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService_duc {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToRoomDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        return mapToRoomDTO(room);
    }

    @Transactional
    public RoomDTO createRoom(RoomDTO roomDTO) {
        Room room = new Room();
        room.setName(roomDTO.getName());
        room.setTotalRows(roomDTO.getTotalRows());
        room.setSeatsPerRow(roomDTO.getSeatsPerRow());

        List<Seat> defaultSeats = generateDefaultSeats(room);
        room.setSeats(defaultSeats); 

        Room savedRoom = roomRepository.save(room); 
        return mapToRoomDTO(savedRoom);
    }

    @Transactional
    public RoomDTO updateRoom(Long roomId, RoomDTO roomDTO) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

        boolean dimensionsChanged = !room.getTotalRows().equals(roomDTO.getTotalRows()) ||
                                   !room.getSeatsPerRow().equals(roomDTO.getSeatsPerRow());

        room.setName(roomDTO.getName());
        room.setTotalRows(roomDTO.getTotalRows());
        room.setSeatsPerRow(roomDTO.getSeatsPerRow());

        if (dimensionsChanged) {
            seatRepository.deleteByRoomId(roomId); 
            room.getSeats().clear(); 
            List<Seat> newSeats = generateDefaultSeats(room);
            room.setSeats(newSeats); 
        }

        Room updatedRoom = roomRepository.save(room);
        return mapToRoomDTO(updatedRoom);
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        roomRepository.delete(room); 
    }

    public RoomLayoutDTO getRoomLayout(Long roomId) {
        Room room = roomRepository.findByIdWithSeats(roomId).orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        RoomLayoutDTO dto = new RoomLayoutDTO();
        dto.setRoomId(room.getId());
        dto.setRoomName(room.getName());
        dto.setTotalRows(room.getTotalRows());
        dto.setSeatsPerRow(room.getSeatsPerRow());
        dto.setSeats(room.getSeats() == null ? List.of() : room.getSeats().stream().map(this::mapToSeatDTO).collect(Collectors.toList()));
        return dto;
    }

    @Transactional
public RoomLayoutDTO updateRoomLayout(Long roomId, RoomLayoutDTO layoutDTO) {
    Room room = roomRepository.findById(roomId) // Fetch the room first
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

    if (!room.getTotalRows().equals(layoutDTO.getTotalRows()) || !room.getSeatsPerRow().equals(layoutDTO.getSeatsPerRow())) {
        throw new IllegalArgumentException("Cannot change room dimensions via layout update. Use the room update endpoint (/api/admin/rooms/{roomId}).");
    }

    seatRepository.deleteByRoomId(roomId);
    roomRepository.flush(); 
    if (room.getSeats() != null) {
         room.getSeats().clear();
    } else {
        room.setSeats(new ArrayList<>()); 
    }
    

    
    List<Seat> newSeats = layoutDTO.getSeats().stream()
            .map(seatDTO -> mapToSeatEntity(seatDTO, room)) 
            .collect(Collectors.toList());

   
    room.getSeats().addAll(newSeats);

   
    Room savedRoom = roomRepository.save(room); 

   
    layoutDTO.setRoomId(savedRoom.getId());
    layoutDTO.setRoomName(savedRoom.getName());
    layoutDTO.setSeats(savedRoom.getSeats().stream().map(this::mapToSeatDTO).collect(Collectors.toList()));
    return layoutDTO;
}

    private List<Seat> generateDefaultSeats(Room room) {
        List<Seat> seats = new ArrayList<>();
        if (room.getTotalRows() == null || room.getSeatsPerRow() == null) return seats; 
        for (int i = 0; i < room.getTotalRows(); i++) {
            String rowLabel = String.valueOf((char) ('A' + i));
            for (int j = 0; j < room.getSeatsPerRow(); j++) {
                Seat seat = new Seat();
                seat.setRoom(room);
                seat.setRowLabel(rowLabel);
                seat.setSeatNumber(j + 1);
                seat.setType("STANDARD"); 
                seats.add(seat);
            }
        }
        return seats;
    }

     private RoomDTO mapToRoomDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setTotalRows(room.getTotalRows());
        dto.setSeatsPerRow(room.getSeatsPerRow());
        return dto;
    }

    SeatDTO mapToSeatDTO(Seat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        dto.setRowLabel(seat.getRowLabel());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setType(seat.getType());
        return dto;
    }

    private Seat mapToSeatEntity(SeatDTO dto, Room room) {
        Seat seat = new Seat();
        seat.setRoom(room);
        seat.setRowLabel(dto.getRowLabel());
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setType(dto.getType());
        return seat;
    }
}