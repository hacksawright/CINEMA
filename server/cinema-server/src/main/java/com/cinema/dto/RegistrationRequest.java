
package com.cinema.dto;

public record RegistrationRequest(
    String email, 
    String password, 
    String fullName
) {}