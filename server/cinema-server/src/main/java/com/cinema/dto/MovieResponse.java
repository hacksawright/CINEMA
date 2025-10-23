package com.cinema.dto;

import com.cinema.model.Movie;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer durationMinutes;
    private String rating;
    private LocalDate releaseDate;
    private String posterUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public MovieResponse() {}

    public MovieResponse(Long id, String title, String description, String genre, Integer durationMinutes,
                        String rating, LocalDate releaseDate, String posterUrl, String status,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.durationMinutes = durationMinutes;
        this.rating = rating;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static method to convert Entity to DTO
    public static MovieResponse fromEntity(Movie movie) {
        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getGenre(),
                movie.getDurationMinutes(),
                movie.getRating(),
                movie.getReleaseDate(),
                movie.getPosterUrl(),
                movie.getStatus(),
                movie.getCreatedAt(),
                movie.getUpdatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "MovieResponse{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", genre='" + genre + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", status='" + status + '\'' +
                ", releaseDate=" + releaseDate +
                ", createdAt=" + createdAt +
                '}';
    }
}
