package com.cinema.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.cinema.model.Staff;
import com.cinema.service.StaffService;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://192.168.1.9:5173",
    "http://192.168.1.9:8081"
})

public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    @GetMapping
    public List<Staff> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Staff create(@RequestBody Staff staff) {
        return service.create(staff);
    }

    @PutMapping("/{id}")
    public Staff update(@PathVariable Long id, @RequestBody Staff staff) {
        return service.update(id, staff);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}