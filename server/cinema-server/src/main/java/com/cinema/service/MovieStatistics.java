package com.cinema.service;

/**
 * Class chứa thông tin thống kê về phim
 */
public class MovieStatistics {
    
    private long totalMovies;
    private long showingMovies;
    private long upcomingMovies;
    private long endedMovies;
    private long totalGenres;
    private long totalRatings;

    // Constructors
    public MovieStatistics() {}

    public MovieStatistics(long totalMovies, long showingMovies, long upcomingMovies, 
                          long endedMovies, long totalGenres, long totalRatings) {
        this.totalMovies = totalMovies;
        this.showingMovies = showingMovies;
        this.upcomingMovies = upcomingMovies;
        this.endedMovies = endedMovies;
        this.totalGenres = totalGenres;
        this.totalRatings = totalRatings;
    }

    // Getters and Setters
    public long getTotalMovies() {
        return totalMovies;
    }

    public void setTotalMovies(long totalMovies) {
        this.totalMovies = totalMovies;
    }

    public long getShowingMovies() {
        return showingMovies;
    }

    public void setShowingMovies(long showingMovies) {
        this.showingMovies = showingMovies;
    }

    public long getUpcomingMovies() {
        return upcomingMovies;
    }

    public void setUpcomingMovies(long upcomingMovies) {
        this.upcomingMovies = upcomingMovies;
    }

    public long getEndedMovies() {
        return endedMovies;
    }

    public void setEndedMovies(long endedMovies) {
        this.endedMovies = endedMovies;
    }

    public long getTotalGenres() {
        return totalGenres;
    }

    public void setTotalGenres(long totalGenres) {
        this.totalGenres = totalGenres;
    }

    public long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(long totalRatings) {
        this.totalRatings = totalRatings;
    }

    @Override
    public String toString() {
        return "MovieStatistics{" +
                "totalMovies=" + totalMovies +
                ", showingMovies=" + showingMovies +
                ", upcomingMovies=" + upcomingMovies +
                ", endedMovies=" + endedMovies +
                ", totalGenres=" + totalGenres +
                ", totalRatings=" + totalRatings +
                '}';
    }
}
