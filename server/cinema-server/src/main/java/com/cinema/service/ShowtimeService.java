package com.cinema.service;

import com.cinema.dto.SeatDTO;
import com.cinema.dto.ShowtimeSeatInfoDTO;
import com.cinema.entity.Seat;
import com.cinema.entity.Showtime;
import com.cinema.entity.Ticket;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final RoomService roomService;

    public ShowtimeSeatInfoDTO getShowtimeSeatInfo(Long showtimeId) {
        Showtime showtime = showtimeRepository.findByIdWithDetails(showtimeId)
            .orElseThrow(() -> new EntityNotFoundException("Showtime not found: " + showtimeId));

        Long roomId = showtime.getRoom().getId();
        List<Seat> allSeatsInRoom = seatRepository.findByRoomId(roomId);

        List<String> bookedStatuses = List.of("BOOKED", "PAID", "PROCESSING");
         Set<Long> bookedSeatEntityIds = ticketRepository.findBookedSeatIdsByShowtimeIdAndStatus(showtimeId, bookedStatuses);

        List<SeatDTO> allSeatDTOs = allSeatsInRoom.stream()
                .map(roomService::mapToSeatDTO)
                .collect(Collectors.toList());

         List<String> bookedSeatIds = allSeatsInRoom.stream()
            .filter(seat -> bookedSeatEntityIds.contains(seat.getId()))
            .map(seat -> seat.getRowLabel() + seat.getSeatNumber())
            .collect(Collectors.toList());

        ShowtimeSeatInfoDTO dto = new ShowtimeSeatInfoDTO();
        dto.setShowtimeId(showtime.getId());
        dto.setMovieTitle(showtime.getMovie().getTitle());
        dto.setShowDate(showtime.getShowDate());
        dto.setShowTime(showtime.getShowTime());
        dto.setPricePerSeat(showtime.getBasePrice());
        dto.setTotalRows(showtime.getRoom().getTotalRows());
        dto.setSeatsPerRow(showtime.getRoom().getSeatsPerRow());
        dto.setAllSeats(allSeatDTOs);
        dto.setBookedSeatIds(bookedSeatIds);

        return dto;
    }
}