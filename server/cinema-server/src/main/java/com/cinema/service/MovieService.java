package com.cinema.service;

import com.cinema.dto.MovieCreateDto;
import com.cinema.model.Movie;
import java.util.List;

public interface MovieService {
    Movie create(MovieCreateDto dto);
    List<Movie> findAll();
}
