// src/main/java/com/cinema/service/JwtTokenProvider.java

package com.cinema.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Đây là khóa bí mật, hãy thay đổi thành một chuỗi dài, ngẫu nhiên!
    private final String jwtSecret = "DungMotChuoiDaiVaBiMatTren64KyTuDeBaoMatTokenCuaBan"; 
    private final long jwtExpirationMs = 86400000; // 24 giờ

    // Hàm tạo Token
    public String generateToken(String email, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
            .setSubject(email)              // Chủ đề: Email người dùng
            .claim("id", userId)            // Dữ liệu bổ sung: ID người dùng
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key())
            .compact();
}

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}