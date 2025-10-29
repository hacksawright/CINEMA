package com.cinema.service;

import com.cinema.dto.OrderDetailDTO;
import com.cinema.dto.OrderSummaryDTO;
import com.cinema.dto.TransactionDTO;
import com.cinema.model.*;
import com.cinema.exception.ResourceNotFoundException;
import com.cinema.repository.OrderRepository;
import com.cinema.repository.TicketRepository;
import com.cinema.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final TicketRepository ticketRepository;

    public List<OrderSummaryDTO> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAllWithDetails();
        return orders.stream().map(this::mapToOrderSummaryDTO).collect(Collectors.toList());
    }

    public List<OrderSummaryDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdWithDetails(userId);
        return orders.stream().map(this::mapToOrderSummaryDTO).collect(Collectors.toList());
    }

    public OrderDetailDTO getOrderDetail(Long orderId) {
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return mapToOrderDetailDTO(order);
    }

    @Transactional
    public OrderDetailDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String oldStatus = order.getStatus();
        String upperNewStatus = newStatus.toUpperCase();

        if (oldStatus.equals(upperNewStatus)) {
            return orderRepository.findByIdWithDetails(orderId)
                    .map(this::mapToOrderDetailDTO)
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        }

        order.setStatus(upperNewStatus);

        if ("CANCELLED".equals(upperNewStatus) || "REFUNDED".equals(upperNewStatus)) {
            if (order.getTickets() != null && !order.getTickets().isEmpty()) {
                List<Ticket> ticketsToUpdate = order.getTickets().stream()
                 .filter(ticket -> !"CANCELLED".equals(ticket.getStatus()) && !"AVAILABLE".equalsIgnoreCase(ticket.getStatus()))
                 .peek(ticket -> ticket.setStatus("AVAILABLE"))
                 .collect(Collectors.toList());
                 if(!ticketsToUpdate.isEmpty()){
                     ticketRepository.saveAll(ticketsToUpdate);
                 }
            }
        }

        Order updatedOrder = orderRepository.save(order);
        return orderRepository.findByIdWithDetails(updatedOrder.getId())
                .map(this::mapToOrderDetailDTO)
                 .orElseThrow(() -> new ResourceNotFoundException("Order", "id", updatedOrder.getId()));
    }

    private OrderSummaryDTO mapToOrderSummaryDTO(Order order) {
        OrderSummaryDTO dto = new OrderSummaryDTO();
        dto.setId(order.getId());
        dto.setTicketCode(order.getTicketCode());
        dto.setCustomerName(order.getUser() != null ? order.getUser().getFullName() : "N/A");
        dto.setCustomerPhone(order.getUser() != null ? order.getUser().getPhone() : "N/A");

        Optional<Ticket> firstTicket = (order.getTickets() != null && !order.getTickets().isEmpty())
                                       ? order.getTickets().stream().findFirst()
                                       : Optional.empty();
        if (firstTicket.isPresent()) {
            Showtime showtime = firstTicket.get().getShowtime();
            if (showtime != null) {
                dto.setMovieTitle(showtime.getMovie() != null ? showtime.getMovie().getTitle() : "N/A");
                dto.setShowtimeStartsAt(showtime.getStartsAt());
                dto.setRoomName(showtime.getRoom() != null ? showtime.getRoom().getName() : "N/A");
            }
        } else {
             dto.setMovieTitle("N/A");
             dto.setRoomName("N/A");
        }

        dto.setSeatLabels(order.getTickets() != null ? order.getTickets().stream()
                .map(t -> t.getSeat() != null ? t.getSeat().getRowLabel() + t.getSeat().getSeatNumber() : "?")
                .collect(Collectors.toList()) : List.of());

        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getCreatedAt());

        Optional<Transaction> relevantTransaction = (order.getTransactions() != null && !order.getTransactions().isEmpty())
                                                   ? order.getTransactions().stream()
                                                       .filter(tx -> "SUCCESS".equalsIgnoreCase(tx.getStatus()) || "PENDING".equalsIgnoreCase(tx.getStatus()))
                                                       .max(Comparator.comparing(Transaction::getCreatedAt))
                                                   : Optional.empty();
        dto.setPaymentMethod(relevantTransaction.map(Transaction::getPaymentMethod).orElse("N/A"));

        return dto;
    }

     private OrderDetailDTO mapToOrderDetailDTO(Order order) {
        OrderDetailDTO dto = new OrderDetailDTO();
        OrderSummaryDTO summary = mapToOrderSummaryDTO(order);

        dto.setId(summary.getId());
        dto.setTicketCode(summary.getTicketCode());
        dto.setCustomerName(summary.getCustomerName());
        dto.setCustomerPhone(summary.getCustomerPhone());
        dto.setMovieTitle(summary.getMovieTitle());
        dto.setShowtimeStartsAt(summary.getShowtimeStartsAt());
        dto.setRoomName(summary.getRoomName());
        dto.setSeatLabels(summary.getSeatLabels());
        dto.setTotalAmount(summary.getTotalAmount());
        dto.setStatus(summary.getStatus());
        dto.setPaymentMethod(summary.getPaymentMethod());
        dto.setOrderDate(summary.getOrderDate());

        dto.setCustomerEmail(order.getUser() != null ? order.getUser().getEmail() : "N/A");

        dto.setTransactions((order.getTransactions() != null && !order.getTransactions().isEmpty())
            ? order.getTransactions().stream()
                .map(this::mapToTransactionDTO)
                .sorted(Comparator.comparing(TransactionDTO::getTransactionDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList())
            : List.of());

        dto.setPaymentDate((order.getTransactions() != null && !order.getTransactions().isEmpty())
            ? order.getTransactions().stream()
                .filter(tx -> "SUCCESS".equalsIgnoreCase(tx.getStatus()) && tx.getPaidAt() != null)
                .map(Transaction::getPaidAt)
                .min(LocalDateTime::compareTo)
                .orElse(null)
            : null);

        return dto;
    }


     private TransactionDTO mapToTransactionDTO(Transaction tx) {
         TransactionDTO dto = new TransactionDTO();
         dto.setId(tx.getId());
         dto.setOrderId(tx.getOrder() != null ? tx.getOrder().getId() : null);
         dto.setTicketCode(tx.getOrder() != null ? tx.getOrder().getTicketCode() : null);
         dto.setAmount(tx.getAmount());
         dto.setPaymentMethod(tx.getPaymentMethod());
         dto.setStatus(tx.getStatus());
         dto.setTransactionDate(tx.getCreatedAt());
         dto.setPaidAt(tx.getPaidAt());

         if (tx.getOrder() != null) {
             Order order = tx.getOrder();
             dto.setCustomerName(order.getUser() != null ? order.getUser().getFullName() : null);
             Optional<Ticket> firstTicket = (order.getTickets() != null && !order.getTickets().isEmpty())
                                            ? order.getTickets().stream().findFirst()
                                            : Optional.empty();
             if (firstTicket.isPresent() && firstTicket.get().getShowtime() != null) {
                 Showtime showtime = firstTicket.get().getShowtime();
                 dto.setMovieTitle(showtime.getMovie() != null ? showtime.getMovie().getTitle() : null);
                 dto.setShowtimeStartsAt(showtime.getStartsAt());
             }
         }
         return dto;
     }
}