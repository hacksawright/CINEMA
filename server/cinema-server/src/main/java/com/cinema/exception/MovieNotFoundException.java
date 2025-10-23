package com.cinema.exception;

/**
 * Exception được ném khi không tìm thấy phim
 */
public class MovieNotFoundException extends RuntimeException {
    
    public MovieNotFoundException(String message) {
        super(message);
    }
    
    public MovieNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public MovieNotFoundException(Long id) {
        super("Không tìm thấy phim với ID: " + id);
    }
}
