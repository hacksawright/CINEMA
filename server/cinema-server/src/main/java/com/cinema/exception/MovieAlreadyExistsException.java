package com.cinema.exception;

/**
 * Exception được ném khi phim đã tồn tại
 */
public class MovieAlreadyExistsException extends RuntimeException {
    
    public MovieAlreadyExistsException(String message) {
        super(message);
    }
    
    public MovieAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static MovieAlreadyExistsException withTitle(String title) {
        return new MovieAlreadyExistsException("Phim với tên '" + title + "' đã tồn tại");
    }
}
