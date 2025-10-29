package com.cinema.service;

import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;
import com.cinema.model.*;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BookingService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        Long currentUserId = 1L; 
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + currentUserId));

        Showtime showtime = showtimeRepository.findByIdWithDetails(request.getShowtimeId())
                .orElseThrow(() -> new EntityNotFoundException("Showtime not found: " + request.getShowtimeId()));
        Long roomId = showtime.getRoom().getId();

        List<Ticket> ticketsForOrder = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        String nextTicketStatus;
        String orderStatus;
        String transactionStatus;
        LocalDateTime paidAt = null;

        if ("cash".equalsIgnoreCase(request.getPaymentMethod())) {
            nextTicketStatus = "SOLD";
            orderStatus = "COMPLETED";
            transactionStatus = "SUCCESS";
            paidAt = LocalDateTime.now();
        } else {
            nextTicketStatus = "BOOKED";
            orderStatus = "PROCESSING";
            transactionStatus = "PENDING";
        }

        for (String seatIdString : request.getSelectedSeats()) {
             String rowLabel = "";
             int seatNumber = 0;
             try {
                rowLabel = seatIdString.substring(0, 1).toUpperCase();
                seatNumber = Integer.parseInt(seatIdString.substring(1));
                if (!Character.isLetter(rowLabel.charAt(0)) || seatNumber <= 0){
                   throw new IllegalArgumentException();
                }
             } catch (Exception e){
                throw new IllegalArgumentException("Invalid seat identifier format: " + seatIdString);
             }


             Seat seat = seatRepository.findByRoomIdAndRowLabelAndSeatNumber(roomId, rowLabel, seatNumber)
                     .orElseThrow(() -> new IllegalArgumentException("Seat not found in room: " + seatIdString));

             Optional<Ticket> existingTicketOpt = ticketRepository.findByShowtimeIdAndSeatId(showtime.getId(), seat.getId());

             Ticket ticket;
             if (existingTicketOpt.isPresent()) {
                 ticket = existingTicketOpt.get();
                 if (!"AVAILABLE".equalsIgnoreCase(ticket.getStatus())) {
                     throw new IllegalStateException("Seat " + seatIdString + " is not available.");
                 }
                 ticket.setPrice(showtime.getBasePrice());
             } else {
                 ticket = new Ticket();
                 ticket.setShowtime(showtime);
                 ticket.setSeat(seat);
                 ticket.setPrice(showtime.getBasePrice());
                 ticket.setStatus("AVAILABLE");
             }

              ticket.setStatus(nextTicketStatus);
              Ticket savedTicket = ticketRepository.save(ticket);
              ticketsForOrder.add(savedTicket);
              totalAmount = totalAmount.add(savedTicket.getPrice());
        }

        Order newOrder = new Order();
        newOrder.setUser(currentUser);
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus(orderStatus);
        newOrder.setTicketCode("TKT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        newOrder.setTickets(ticketsForOrder);

        Order savedOrder = orderRepository.save(newOrder);


        Transaction transaction = new Transaction();
        transaction.setOrder(savedOrder);
        transaction.setAmount(totalAmount);
        transaction.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        transaction.setStatus(transactionStatus);
        transaction.setPaidAt(paidAt);
        transactionRepository.save(transaction);

        BookingResponseDTO response = new BookingResponseDTO();
        response.setBookingId(savedOrder.getId());
        response.setTicketCode(savedOrder.getTicketCode());
        response.setStatus(savedOrder.getStatus());
        response.setSeats(request.getSelectedSeats());
        response.setTotalAmount(savedOrder.getTotalAmount());

        return response;
    }
}