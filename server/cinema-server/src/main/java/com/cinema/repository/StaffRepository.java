package com.cinema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
}