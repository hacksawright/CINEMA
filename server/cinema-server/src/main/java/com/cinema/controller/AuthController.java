

package com.cinema.controller;

import com.cinema.dto.LoginRequest;
import com.cinema.dto.RegistrationRequest;
import com.cinema.dto.LoginResponse;
import com.cinema.service.AuthService;

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
            // Gọi hàm login để xác thực và nhận JWT Token + UserId
            LoginResponse response = authService.login(loginRequest); 
            
            // Nếu không có lỗi, trả về HTTP 200 OK và đối tượng LoginResponse (JSON)
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            // Nếu AuthService.login() ném ra RuntimeException (lỗi email/mật khẩu), trả về 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}