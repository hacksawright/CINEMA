package com.cinema.service.impl;

import com.cinema.dto.MovieCreateDto;
import com.cinema.model.Movie;
import com.cinema.repository.MovieRepository;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public Movie create(MovieCreateDto dto) {
        Movie m = Movie.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .durationMinutes(dto.getDurationMinutes())
                .rating(dto.getRating())
                .releaseDate(dto.getReleaseDate())
                .build();
        return movieRepository.save(m);
    }

    @Override
    public List<Movie> findAll() {
        return movieRepository.findAll();
    }
}
