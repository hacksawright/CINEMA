package com.cinema.controller;

import com.cinema.dto.*;
import com.cinema.model.Ticket;
import com.cinema.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket create(@RequestBody TicketCreateDto dto) {
        return ticketService.create(dto);
    }

    @GetMapping
    public List<TicketResponseDto> getAllTickets(
            @RequestParam(required = false) Long showtimeId,
            @RequestParam(required = false) Long seatId
    ) {
        return ticketService.findAllWithDetails(showtimeId, seatId);
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable Long id) {
        return ticketService.getById(id);
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable Long id, @RequestBody TicketUpdateDto dto) {
        return ticketService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ticketService.delete(id);
    }
}
