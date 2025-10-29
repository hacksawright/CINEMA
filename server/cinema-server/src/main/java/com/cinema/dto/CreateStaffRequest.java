package com.cinema.dto;

public record CreateStaffRequest(
    String name,
    String email,
    String phone,
    String role,  // role code: "admin", "ticket_seller", "usher", "accountant"
    String status,
    String address,
    String password
) {}

