
package com.cinema.dto;

public record LoginRequest(
    String email,
    String password
) {}