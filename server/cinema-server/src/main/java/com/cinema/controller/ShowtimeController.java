package com.cinema.controller;

import com.cinema.dto.ShowtimeDto;
import com.cinema.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShowtimeDto create(@RequestBody @Valid ShowtimeDto dto) {
        return showtimeService.create(dto);
    }

    @GetMapping("/{id}")
    public ShowtimeDto get(@PathVariable Long id) {
        return showtimeService.getById(id);
    }

    @GetMapping
    public Page<ShowtimeDto> list(Pageable pageable) {
        return showtimeService.list(pageable);
    }

    @PutMapping("/{id}")
    public ShowtimeDto update(@PathVariable Long id, @RequestBody @Valid ShowtimeDto dto) {
        return showtimeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        showtimeService.delete(id);
    }
}