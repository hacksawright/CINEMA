package com.cinema.repository;

import com.cinema.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

     @Query("SELECT t FROM Transaction t " +
            "JOIN FETCH t.order o " +
            "JOIN FETCH o.user u " +
            "LEFT JOIN FETCH o.tickets ticket " +
            "LEFT JOIN FETCH ticket.showtime sh " +
            "LEFT JOIN FETCH sh.movie m " +
            "ORDER BY t.createdAt DESC")
    List<Transaction> findAllWithOrderDetails();

}