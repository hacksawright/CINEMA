package com.cinema.service.impl;

import com.cinema.dto.BookingRequestDTO;
import com.cinema.dto.BookingResponseDTO;
import com.cinema.model.*;
import com.cinema.repository.*;
import com.cinema.service.BookingService; 
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

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final OrderRepository orderRepository; 
    private final UserRepository userRepository; 
    private final TransactionRepository transactionRepository;


    @Override
    @Transactional
    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) { 

        // Lấy User từ tham số (userId được lấy từ DTO hoặc Principal ở Controller)
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required to create a booking.");
        }

        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Lấy thông tin suất chiếu
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
            .orElseThrow(() -> new EntityNotFoundException("Showtime not found: " + request.getShowtimeId()));
        Long roomId = showtime.getRoom().getId();

        List<Ticket> ticketsForOrder = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Định nghĩa trạng thái theo phương thức thanh toán
        String nextTicketStatus;
        String orderStatus;
        String transactionStatus;
        LocalDateTime paidAt = null;

        if ("cash".equalsIgnoreCase(request.getPaymentMethod())) {
            nextTicketStatus = "SOLD"; // Ghế phải đổi màu đỏ ngay lập tức
            orderStatus = "COMPLETED";
            transactionStatus = "SUCCESS";
            paidAt = LocalDateTime.now();
        } else {
            nextTicketStatus = "BOOKED"; // Ghế phải đổi màu đỏ ngay lập tức
            orderStatus = "PROCESSING";
            transactionStatus = "PENDING";
        }

        // Lặp qua ghế được chọn
        for (String seatIdString : request.getSelectedSeats()) {
            String rowLabel;
            int seatNumber;
            try {
                rowLabel = seatIdString.substring(0, 1).toUpperCase();
                seatNumber = Integer.parseInt(seatIdString.substring(1));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid seat identifier format: " + seatIdString);
            }

            Seat seat = seatRepository.findByRoomIdAndRowLabelAndSeatNumber(roomId, rowLabel, seatNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Seat not found in room: " + seatIdString));
            Optional<Ticket> existingTicketOpt = ticketRepository.findByShowtime_IdAndSeat_Id(showtime.getId(), seat.getId());

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

            ticket.setStatus(nextTicketStatus);
            ticketsForOrder.add(ticket);
            totalAmount = totalAmount.add(ticket.getPrice());
        }

        // Tạo Order
        Order newOrder = new Order();
        newOrder.setUser(currentUser);
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus(orderStatus);
        newOrder.setTicketCode("TKT-" + System.currentTimeMillis() + "-" +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        newOrder.setTickets(ticketsForOrder);

        Order savedOrder = orderRepository.save(newOrder);

        // Cập nhật vé (Đã lưu trạng thái mới ở đây)
        for (Ticket ticket : ticketsForOrder) {
            ticket.setOrder(savedOrder);
            ticketRepository.save(ticket);
        }

        // Tạo Transaction
        Transaction transaction = new Transaction();
        transaction.setOrder(savedOrder);
        transaction.setAmount(totalAmount);
        transaction.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        transaction.setStatus(transactionStatus);
        transaction.setPaidAt(paidAt);
        transactionRepository.save(transaction);

        // Trả về Response
        return BookingResponseDTO.builder()
                .bookingId(savedOrder.getId())
                .ticketCode(savedOrder.getTicketCode())
                .status(savedOrder.getStatus())
                .seats(request.getSelectedSeats())
                .totalAmount(savedOrder.getTotalAmount())
                .build();
    }
}