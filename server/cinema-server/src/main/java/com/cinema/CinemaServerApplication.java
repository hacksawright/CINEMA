package com.cinema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.cinema")
public class CinemaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CinemaServerApplication.class, args);
    }
}

