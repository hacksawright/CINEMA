package com.cinema.service;

import com.cinema.dto.LoginRequest;
import com.cinema.dto.RegistrationRequest;
import com.cinema.dto.LoginResponse; 
import com.cinema.repository.UserRepository;
import com.cinema.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider; // Thêm provider

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    // 1. Chức năng Đăng ký (Register)
    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email đã tồn tại.");
        }
        
        User user = new User();
        user.setEmail(request.email());
        user.setFullName(request.fullName()); 
        user.setPhone(null); 
        
        // MÃ HÓA MẬT KHẨU
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        
        return userRepository.save(user);
    }

    // 2. Chức năng Đăng nhập (Login) - Trả về JWT Token và ID
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng."));

        // So sánh mật khẩu đã mã hóa
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng.");
        }
        
        // Tạo Token sau khi xác thực thành công
        String jwt = tokenProvider.generateToken(user.getEmail(), user.getId());

        // Trả về Token và ID dưới dạng Record
        return new LoginResponse(jwt, user.getId(), user.getFullName());
    }
}