package com.cinema.service.impl;

import com.cinema.dto.*;
import com.cinema.model.Seat;
import com.cinema.model.Showtime;
import com.cinema.model.Ticket;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.TicketRepository;
import com.cinema.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Override
    public Ticket create(TicketCreateDto dto) {
        if (ticketRepository.existsByShowtime_IdAndSeat_Id(dto.getShowtimeId(), dto.getSeatId())) {
            throw new DataIntegrityViolationException("Ticket already exists for this showtime and seat");
        }

        Showtime showtime = showtimeRepository.findById(dto.getShowtimeId())
                .orElseThrow(() -> new IllegalArgumentException("Showtime not found with id=" + dto.getShowtimeId()));
        
        Seat seat = seatRepository.findById(dto.getSeatId())
                .orElseThrow(() -> new IllegalArgumentException("Seat not found with id=" + dto.getSeatId()));

        Ticket t = new Ticket();
        t.setShowtime(showtime);
        t.setSeat(seat);
        t.setPrice(dto.getPrice());
        t.setStatus(dto.getStatus() == null ? "AVAILABLE" : dto.getStatus());

        return ticketRepository.save(t);
    }

    @Override
    public Ticket getById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
    }

    @Override
    public List<TicketResponseDto> findAllWithDetails(Long showtimeId, Long seatId) {
        List<Object[]> results = ticketRepository.findTicketsWithDetailsNative(showtimeId, seatId);

        return results.stream().map(obj -> TicketResponseDto.builder()
                .ticketId(((Number) obj[0]).longValue())
                .seatLabel((String) obj[1])
                .startsAt(((java.sql.Timestamp) obj[2]).toLocalDateTime())
                .endsAt(((java.sql.Timestamp) obj[3]).toLocalDateTime())
                .price((java.math.BigDecimal) obj[4])
                .status((String) obj[5])
                .build()
        ).collect(Collectors.toList());
    }


    @Override
    public Ticket update(Long id, TicketUpdateDto dto) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        if (dto.getPrice() != null) t.setPrice(dto.getPrice());
        if (dto.getStatus() != null) t.setStatus(dto.getStatus());
        return ticketRepository.save(t);
    }

    @Override
    public void delete(Long id) {
        ticketRepository.deleteById(id);
    }
}