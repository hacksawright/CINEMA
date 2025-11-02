package com.cinema.service;

import com.cinema.model.Admin;
import com.cinema.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public boolean validateAdmin(String username, String password) {
        Optional<Admin> admin = repository.findByUsername(username);
        return admin.isPresent() && admin.get().getPassword().equals(password);
    }
}