package com.cinema.service;

import com.cinema.dto.ShowtimeDetailResponse;
import com.cinema.dto.ShowtimeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShowtimeService {
    ShowtimeDto create(ShowtimeDto dto);
    ShowtimeDto update(Long id, ShowtimeDto dto);
    ShowtimeDto getById(Long id);
    Page<ShowtimeDto> list(Pageable pageable);
    void delete(Long id);
    ShowtimeDetailResponse getShowtimeDetails(Long showtimeId);
}