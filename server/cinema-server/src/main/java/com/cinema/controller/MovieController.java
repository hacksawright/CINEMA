package com.cinema.controller;

import com.cinema.dto.MovieCreateDto;
import com.cinema.model.Movie;
import com.cinema.service.MovieService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Movie create(@RequestBody @Valid MovieCreateDto dto) {
        return movieService.create(dto);
    }

    @GetMapping
    public List<Movie> getAll() {
        return movieService.findAll();
    }
}
