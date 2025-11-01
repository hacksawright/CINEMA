package com.cinema.repository;

import com.cinema.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface StatsRepository extends JpaRepository<Ticket, Long> {

   @Query(value = """
    SELECT 
        (SELECT COUNT(*) FROM movies) AS total_movies,
        (SELECT COUNT(*) FROM tickets WHERE status <> 'AVAILABLE') AS tickets_sold,
        (SELECT COALESCE(SUM(amount),0) 
         FROM transactions 
         WHERE status = 'PAID' AND DATE(paid_at) = :date) AS revenue
    """, nativeQuery = true)
    Object getDailyReportByDateNative(@Param("date") LocalDate date);

}
