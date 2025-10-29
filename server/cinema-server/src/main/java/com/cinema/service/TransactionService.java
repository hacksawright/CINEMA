package com.cinema.service;

import com.cinema.dto.TransactionDTO;
import com.cinema.model.Order;
import com.cinema.model.Showtime;
import com.cinema.model.Ticket;
import com.cinema.model.Transaction;
import com.cinema.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<TransactionDTO> getAllTransactionsForAdmin() {
        List<Transaction> transactions = transactionRepository.findAllWithOrderDetails();
        return transactions.stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
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