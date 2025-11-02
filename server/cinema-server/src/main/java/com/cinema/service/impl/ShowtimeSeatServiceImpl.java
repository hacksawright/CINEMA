package com.cinema.service.impl;

import com.cinema.dto.SeatDTO;
import com.cinema.dto.ShowtimeSeatInfoDTO;
import com.cinema.model.Room;
import com.cinema.model.Seat;
import com.cinema.model.Showtime;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.TicketRepository;
import com.cinema.service.ShowtimeSeatService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ShowtimeSeatServiceImpl implements ShowtimeSeatService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    private static final List<String> BOOKED_STATUSES =
            List.of("BOOKED", "PAID", "PROCESSING", "SOLD");

    @Override
    public ShowtimeSeatInfoDTO getShowtimeSeatInfo(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new EntityNotFoundException("Suất chiếu không tồn tại: " + showtimeId));

        Room room = showtime.getRoom();
        List<Seat> allSeatsInRoom = seatRepository.findByRoomId(room.getId());
        
        // ********** ĐÃ SỬA LỖI: SỬ DỤNG STREAMS ĐỂ CHUYỂN ĐỔI **********
        Set<Long> bookedSeatIds = ticketRepository.findByShowtime_IdAndStatusIn(showtimeId, BOOKED_STATUSES)
                .stream() 
                .map(ticket -> ticket.getSeat().getId()) // Ánh xạ từ Ticket sang Seat ID
                .collect(Collectors.toSet()); // Thu thập thành Set<Long>
        // ***************************************************************

        List<SeatDTO> allSeatDTOs = allSeatsInRoom.stream()
                .map(seat -> mapToSeatDTO(seat, bookedSeatIds))
                .collect(Collectors.toList());

        List<String> bookedSeatCodes = allSeatsInRoom.stream()
                .filter(seat -> bookedSeatIds.contains(seat.getId()))
                .map(seat -> seat.getRowLabel() + seat.getSeatNumber())
                .collect(Collectors.toList());

        return ShowtimeSeatInfoDTO.builder()
                .showtimeId(showtime.getId())
                .movieTitle(showtime.getMovie().getTitle())
                .showDate(showtime.getStartsAt() != null ? showtime.getStartsAt().toLocalDate() : null)
                .showTime(showtime.getStartsAt() != null ? showtime.getStartsAt().toLocalTime() : null)
                .pricePerSeat(showtime.getBasePrice())
                .roomId(room.getId())
                .roomName(room.getName())
                .totalRows(room.getTotalRows())
                .seatsPerRow(room.getSeatsPerRow())
                .allSeats(List.copyOf(allSeatDTOs))
                .bookedSeatIds(bookedSeatCodes)
                .build();
    }

    private SeatDTO mapToSeatDTO(Seat seat, Set<Long> bookedSeatIds) {
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        dto.setRowLabel(seat.getRowLabel());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setType(seat.getType());
        dto.setBooked(bookedSeatIds.contains(seat.getId()));
        return dto;
    }
}