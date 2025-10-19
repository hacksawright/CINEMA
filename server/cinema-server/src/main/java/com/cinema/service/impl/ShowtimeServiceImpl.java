package com.cinema.service.impl;

import com.cinema.dto.ShowtimeDto;
import com.cinema.exception.NotFoundException;
import com.cinema.model.Movie;
import com.cinema.model.Room;
import com.cinema.model.Showtime;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class ShowtimeServiceImpl implements ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public ShowtimeDto create(ShowtimeDto dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new NotFoundException("Movie not found: " + dto.getMovieId()));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new NotFoundException("Room not found: " + dto.getRoomId()));

        Showtime s = Showtime.builder()
                .movie(movie)
                .room(room)
                .startsAt(dto.getStartsAt())
                .endsAt(dto.getEndsAt())
                .basePrice(dto.getBasePrice())
                .build();

        s = showtimeRepository.save(s);
        return toDto(s);
    }

    @Override
    public ShowtimeDto update(Long id, ShowtimeDto dto) {
        Showtime s = showtimeRepository.findById(id).orElseThrow(() -> new NotFoundException("Showtime not found: " + id));
        if (dto.getMovieId() != null) {
            Movie movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> new NotFoundException("Movie not found: " + dto.getMovieId()));
            s.setMovie(movie);
        }
        if (dto.getRoomId() != null) {
            Room room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new NotFoundException("Room not found: " + dto.getRoomId()));
            s.setRoom(room);
        }
        if (dto.getStartsAt() != null) s.setStartsAt(dto.getStartsAt());
        if (dto.getEndsAt() != null) s.setEndsAt(dto.getEndsAt());
        if (dto.getBasePrice() != null) s.setBasePrice(dto.getBasePrice());

        s = showtimeRepository.save(s);
        return toDto(s);
    }

    @Override
    public ShowtimeDto getById(Long id) {
        return showtimeRepository.findById(id).map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Showtime not found: " + id));
    }

    @Override
    public Page<ShowtimeDto> list(Pageable pageable) {
        Page<Showtime> p = showtimeRepository.findAll(pageable);
        return new PageImpl<>(p.stream().map(this::toDto).collect(Collectors.toList()), pageable, p.getTotalElements());
    }

    @Override
    public void delete(Long id) {
        if (!showtimeRepository.existsById(id)) throw new NotFoundException("Showtime not found: " + id);
        showtimeRepository.deleteById(id);
    }

    private ShowtimeDto toDto(Showtime s) {
        return ShowtimeDto.builder()
                .id(s.getId())
                .movieId(s.getMovie() != null ? s.getMovie().getId() : null)
                .roomId(s.getRoom() != null ? s.getRoom().getId() : null)
                .startsAt(s.getStartsAt())
                .endsAt(s.getEndsAt())
                .basePrice(s.getBasePrice())
                .build();
    }
}
