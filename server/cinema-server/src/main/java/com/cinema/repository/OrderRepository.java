package com.cinema.repository;

import com.cinema.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    @Query("SELECT o FROM Order o JOIN FETCH o.user u LEFT JOIN FETCH o.tickets t LEFT JOIN FETCH t.seat s LEFT JOIN FETCH t.showtime sh JOIN FETCH sh.movie m JOIN FETCH sh.room r WHERE o.id = :orderId")
    Optional<Order> findByIdWithDetails(@Param("orderId") Long orderId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN FETCH o.user u " +
           "LEFT JOIN FETCH o.tickets t " +
           "LEFT JOIN FETCH t.seat s " +
           "LEFT JOIN FETCH t.showtime sh " +
           "JOIN FETCH sh.movie m " +
           "JOIN FETCH sh.room r " +
           "WHERE u.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdWithDetails(@Param("userId") Long userId);

     @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN FETCH o.user u " +
            "LEFT JOIN FETCH o.tickets t " +
            "LEFT JOIN FETCH t.seat s " +
            "LEFT JOIN FETCH t.showtime sh " +
            "JOIN FETCH sh.movie m " +
            "JOIN FETCH sh.room r " +
            "ORDER BY o.createdAt DESC")
     List<Order> findAllWithDetails();
}