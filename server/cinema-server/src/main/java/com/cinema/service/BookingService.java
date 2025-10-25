package com.cinema.service;
import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;
import com.cinema.entity.Seat;
import com.cinema.entity.Showtime;
import com.cinema.entity.Ticket;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.TicketRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        Showtime showtime = showtimeRepository.findByIdWithDetails(request.getShowtimeId())
                .orElseThrow(() -> new EntityNotFoundException("Showtime not found: " + request.getShowtimeId()));
        Long roomId = showtime.getRoom().getId();

        List<Ticket> ticketsToBook = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (String seatIdString : request.getSelectedSeats()) {
            String rowLabel = seatIdString.substring(0, 1);
            int seatNumber = Integer.parseInt(seatIdString.substring(1));

            Seat seat = seatRepository.findByRoomIdAndRowLabelAndSeatNumber(roomId, rowLabel, seatNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid seat identifier: " + seatIdString));

            Optional<Ticket> existingTicketOpt = ticketRepository.findByShowtimeIdAndSeatId(showtime.getId(), seat.getId());

            Ticket ticket;
            if (existingTicketOpt.isPresent()) {
                ticket = existingTicketOpt.get();
                if (!"AVAILABLE".equalsIgnoreCase(ticket.getStatus())) {
                    throw new IllegalStateException("Seat " + seatIdString + " is not available.");
                }
            } else {
                ticket = new Ticket();
                ticket.setShowtime(showtime);
                ticket.setSeat(seat);
                ticket.setPrice(showtime.getBasePrice());
                ticket.setStatus("AVAILABLE");
            }

             String nextStatus = "cash".equalsIgnoreCase(request.getPaymentMethod()) ? "PAID" : "BOOKED";
             ticket.setStatus(nextStatus);
             ticketsToBook.add(ticket);
             totalAmount = totalAmount.add(ticket.getPrice());
        }

        ticketRepository.saveAll(ticketsToBook);

        String ticketCode = "TKT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        BookingResponseDTO response = new BookingResponseDTO();
        response.setTicketCode(ticketCode);
        response.setStatus("cash".equalsIgnoreCase(request.getPaymentMethod()) ? "paid" : "processing");
        response.setSeats(request.getSelectedSeats());
        response.setTotalAmount(totalAmount);

        return response;
    }
}