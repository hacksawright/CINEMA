package com.cinema.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class MovieRequest {

    @NotBlank(message = "Tên phim không được để trống")
    @Size(max = 255, message = "Tên phim không được vượt quá 255 ký tự")
    private String title;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;

    @Size(max = 100, message = "Thể loại không được vượt quá 100 ký tự")
    private String genre;

    @NotNull(message = "Thời lượng không được để trống")
    @Positive(message = "Thời lượng phải là số dương")
    private Integer durationMinutes;

    @Size(max = 20, message = "Rating không được vượt quá 20 ký tự")
    private String rating;

    private LocalDate releaseDate;

    @Size(max = 255, message = "URL poster không được vượt quá 255 ký tự")
    private String posterUrl;

    @Size(max = 50, message = "Trạng thái không được vượt quá 50 ký tự")
    private String status = "upcoming";

    // Constructors
    public MovieRequest() {}

    public MovieRequest(String title, String description, String genre, Integer durationMinutes,
                       String rating, LocalDate releaseDate, String posterUrl, String status) {
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.durationMinutes = durationMinutes;
        this.rating = rating;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.status = status;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "MovieRequest{" +
                "title='" + title + '\'' +
                ", genre='" + genre + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", status='" + status + '\'' +
                ", releaseDate=" + releaseDate +
                '}';
    }
}
