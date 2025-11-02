package com.cinema.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081") 
public class AccountController {
    @GetMapping("/getbookings/user") 
    public ResponseEntity<String> getAuthenticatedUserEmail(Principal principal) {
        if (principal == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated"); // Đã sửa thành HttpStatus.UNAUTHORIZED
        }
        return ResponseEntity.ok(principal.getName()); // Trả về email/username
    }
}