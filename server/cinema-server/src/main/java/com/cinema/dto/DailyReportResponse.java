package com.cinema.dto;

public class DailyReportResponse {
    private long totalMovies;
    private long ticketsSold;
    private double revenue;

    public DailyReportResponse(long totalMovies, long ticketsSold, double revenue) {
        this.totalMovies = totalMovies;
        this.ticketsSold = ticketsSold;
        this.revenue = revenue;
    }

    public long getTotalMovies() {
        return totalMovies;
    }

    public long getTicketsSold() {
        return ticketsSold;
    }

    public double getRevenue() {
        return revenue;
    }
}