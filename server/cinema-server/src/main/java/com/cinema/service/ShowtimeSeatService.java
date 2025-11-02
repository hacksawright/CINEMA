package com.cinema.service;

import com.cinema.dto.ShowtimeSeatInfoDTO;

public interface ShowtimeSeatService {
    ShowtimeSeatInfoDTO getShowtimeSeatInfo(Long showtimeId);
}