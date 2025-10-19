package com.cinema.service;

import com.cinema.dto.MovieCreateDto;
import com.cinema.model.Movie;

public interface MovieService {
    Movie create(MovieCreateDto dto);
}
