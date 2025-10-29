package com.cinema.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.cinema.model.Staff;
import com.cinema.repository.StaffRepository;

@Service
public class StaffService {

    private final StaffRepository repository;

    public StaffService(StaffRepository repository) {
        this.repository = repository;
    }

    public List<Staff> getAll() {
        return repository.findAll();
    }

    public Staff create(Staff s) {
        return repository.save(s);
    }

    public Staff update(Long id, Staff s) {
    Staff existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Staff not found"));

    existing.setName(s.getName());
    existing.setPosition(s.getPosition());
    existing.setEmail(s.getEmail());
    existing.setPhone(s.getPhone());
    existing.setSalary(s.getSalary());
    existing.setRole(s.getRole());
    existing.setStatus(s.getStatus()); // ✅ thêm dòng này để cập nhật trạng thái

    return repository.save(existing);
}


    public void delete(Long id) {
        repository.deleteById(id);
    }
}