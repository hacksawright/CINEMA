package com.cinema.controller;

import com.cinema.service.AdminService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        boolean valid = service.validateAdmin(username, password);
        if (valid) {
            return Map.of("status", "success", "role", "admin");
        } else {
            return Map.of("status", "failed", "message", "Invalid credentials");
        }
    }
}