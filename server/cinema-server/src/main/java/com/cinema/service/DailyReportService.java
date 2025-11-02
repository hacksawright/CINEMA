package com.cinema.service;

import com.cinema.dto.DailyReportResponse;
import com.cinema.repository.StatsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DailyReportService {

    private final StatsRepository statsRepository;

    public DailyReportService(StatsRepository statsRepository) {
        this.statsRepository = statsRepository;
    }

    public DailyReportResponse getReportByDate(LocalDate date) {
        Object resultObj = statsRepository.getDailyReportByDateNative(date);

        if (resultObj == null) {
            return new DailyReportResponse(0L, 0L, 0.0);
        }

        Object[] result;
        if (resultObj instanceof Object[]) {
            result = (Object[]) resultObj;
        } else {
            throw new IllegalStateException("Unexpected result type: " + resultObj.getClass());
        }

        Long totalMovies = 0L;
        Long ticketsSold = 0L;
        Double revenue = 0.0;

        if (result.length > 0 && result[0] != null) {
            totalMovies = ((Number) result[0]).longValue();  // ✅ cast sang Number
        }
        if (result.length > 1 && result[1] != null) {
            ticketsSold = ((Number) result[1]).longValue();  // ✅ cast sang Number
        }
        if (result.length > 2 && result[2] != null) {
            revenue = ((Number) result[2]).doubleValue();    // ✅ cast sang Number
        }

        return new DailyReportResponse(totalMovies, ticketsSold, revenue);
    }
}