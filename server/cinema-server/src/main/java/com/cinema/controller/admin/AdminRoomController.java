package com.cinema.controller.admin;

import com.cinema.dto.RoomDTO; // Sử dụng RoomDTO
import com.cinema.dto.RoomLayoutDTO;
import com.cinema.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomDTO roomDTO) {
        RoomDTO createdRoom = roomService.createRoom(roomDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom); 
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long roomId, @Valid @RequestBody RoomDTO roomDTO) {
        RoomDTO updatedRoom = roomService.updateRoom(roomId, roomDTO);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build(); 
    }

    @GetMapping("/{roomId}/layout")
    public ResponseEntity<RoomLayoutDTO> getRoomLayout(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomLayout(roomId));
    }

    @PutMapping("/{roomId}/layout")
    public ResponseEntity<RoomLayoutDTO> updateRoomLayout(@PathVariable Long roomId, @Valid @RequestBody RoomLayoutDTO layoutDTO) {
         if (layoutDTO.getRoomId() != null && !roomId.equals(layoutDTO.getRoomId())) {
             return ResponseEntity.badRequest().build(); 
         }
        layoutDTO.setRoomId(roomId); 
        RoomLayoutDTO updatedLayout = roomService.updateRoomLayout(roomId, layoutDTO);
        return ResponseEntity.ok(updatedLayout);
    }
}