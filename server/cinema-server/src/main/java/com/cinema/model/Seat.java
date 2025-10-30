package com.cinema.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "row_label")
    private String rowLabel;

    @Column(name = "seat_number")
    private Integer seatNumber;

    @Column(name = "seat_type")
    private String seatType;

    @Column(name = "status")
    private Boolean status = true;
}
