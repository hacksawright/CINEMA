package com.cinema.service;

import com.cinema.dto.*;
import com.cinema.model.Ticket;
import java.util.List;

public interface TicketService {
    Ticket create(TicketCreateDto dto);
    Ticket getById(Long id);
    Ticket update(Long id, TicketUpdateDto dto);
    List<TicketResponseDto> findAllWithDetails(Long showtimeId, Long seatId);
    void delete(Long id);
}
