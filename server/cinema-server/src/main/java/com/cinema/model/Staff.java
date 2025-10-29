package com.cinema.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String position;
    private String email;
    private String phone;
    private Double salary;
    private String role;

    // 🆕 thêm trạng thái (ví dụ: "Active", "Inactive", "On Leave")
    private String status;
}