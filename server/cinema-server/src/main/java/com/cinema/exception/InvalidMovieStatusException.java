package com.cinema.exception;

/**
 * Exception được ném khi trạng thái phim không hợp lệ
 */
public class InvalidMovieStatusException extends RuntimeException {
    
    public InvalidMovieStatusException(String message) {
        super(message);
    }
    
    public InvalidMovieStatusException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static InvalidMovieStatusException withStatus(String status) {
        return new InvalidMovieStatusException("Trạng thái phim không hợp lệ: " + status + ". Các trạng thái hợp lệ: showing, upcoming, ended");
    }
}
