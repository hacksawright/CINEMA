

package com.cinema.controller;

import com.cinema.dto.LoginRequest;
import com.cinema.dto.RegistrationRequest;
import com.cinema.dto.LoginResponse;
import com.cinema.service.AuthService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor để Spring tự động Inject AuthService
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ĐĂNG KÝ (POST /api/auth/register)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        try {
            // Gọi hàm đăng ký và trả về HTTP 201 CREATED
            authService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công!");
        } catch (RuntimeException e) {
            // Bắt lỗi nếu Email đã tồn tại hoặc lỗi khác
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ĐĂNG NHẬP (POST /api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // TRẢ VỀ JSON, KHÔNG PHẢI STRING
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error); // ← Bây giờ là JSON
        }
    }
}