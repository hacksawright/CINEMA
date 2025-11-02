package com.cinema.service.impl;

import com.cinema.dto.BookingDetailResponse;
import com.cinema.dto.UserProfileDTO;
import com.cinema.exception.NotFoundException;
import com.cinema.model.Order;
import com.cinema.model.Showtime; // Cần import
import com.cinema.model.User;
import com.cinema.repository.OrderRepository;
import com.cinema.repository.TicketRepository;
import com.cinema.repository.UserRepository;
import com.cinema.service.AccountService;


import org.springframework.transaction.annotation.Transactional; 

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter; // Cần import
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    // Add to the existing field declarations
private final TicketRepository ticketRepository;
    // Định dạng ngày giờ theo DTO
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    @Transactional(readOnly = true) 
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

        return new UserProfileDTO(user.getId(), user.getEmail(), "Tên người dùng đã đăng ký");
    }

    @Override
    @Transactional(readOnly = true) 
    public List<BookingDetailResponse> getUserBookings(Long userId) {
        // SỬA LỖI: Gọi đúng tên phương thức trong OrderRepository (find...Details)
        List<Order> orders = orderRepository.findByUserIdWithDetails(userId); 

        return orders.stream()
                .map(this::mapToBookingDetailResponse)
                .collect(Collectors.toList());
    }

    @Override
@Transactional 
public void cancelBooking(Long bookingId, Long userId) {
    Order order = orderRepository.findById(bookingId)
            .orElseThrow(() -> new NotFoundException("Order not found with ID: " + bookingId));

    if (!order.getUser().getId().equals(userId)) {
        throw new SecurityException("Access denied: Order does not belong to user.");
    }

    order.setStatus("CANCELED");
    orderRepository.save(order);
    // Use the instance variable instead of the class name
    order.getTickets().forEach(ticket -> {
        ticket.setStatus("AVAILABLE");
        ticketRepository.save(ticket);  // Fixed: Using instance variable
    });
}

    // Hàm Ánh xạ dữ liệu (Mapper)
    private BookingDetailResponse mapToBookingDetailResponse(Order order) {
        
        // Lấy thông tin ShowTime và Movie từ Ticket đầu tiên (giả định)
        Showtime showtime = order.getTickets().stream().findFirst()
                                 .map(ticket -> ticket.getShowtime())
                                 .orElse(null); // Lấy đối tượng Showtime
        
        // Tạo đối tượng lồng ShowtimeInfo
        BookingDetailResponse.ShowtimeInfo showtimeInfo = null;
        if (showtime != null) {
            showtimeInfo = new BookingDetailResponse.ShowtimeInfo(
                showtime.getId(),
                showtime.getMovie().getTitle(),
                showtime.getStartsAt().format(TIME_FORMATTER), // Format giờ
                showtime.getStartsAt().format(DATE_FORMATTER)  // Format ngày
            );
        }

        // Tạo danh sách mã ghế
        List<String> seatCodes = order.getTickets().stream()
                    .map(ticket -> ticket.getSeat()) 
                    .map(seat -> seat.getRowLabel() + seat.getSeatNumber())
                    .collect(Collectors.toList());


        // SỬA LỖI: Đồng bộ hóa tham số với BookingDetailResponse DTO
        return new BookingDetailResponse(
                order.getId(),           
                order.getTicketCode(),
                order.getTotalAmount(),  
                order.getStatus(),       
                showtimeInfo,            // Truyền đối tượng lồng
                seatCodes                
        );
    }
}