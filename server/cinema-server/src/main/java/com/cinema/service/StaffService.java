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

    // Lấy danh sách toàn bộ nhân viên
    public List<Staff> getAll() {
        return repository.findAll();
    }

    // Tạo mới nhân viên
    public Staff create(Staff s) {
        // Đảm bảo tất cả fields được set, bao gồm address
        return repository.save(s);
    }

    // Cập nhật thông tin nhân viên
    public Staff update(Long id, Staff s) {
        Staff existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        existing.setName(s.getName());
        existing.setEmail(s.getEmail());
        existing.setPhone(s.getPhone());
        existing.setRole(s.getRole());
        existing.setStatus(s.getStatus());
        existing.setAddress(s.getAddress()); // Lưu địa chỉ

        return repository.save(existing);
    }

    // Xóa nhân viên
    public void delete(Long id) {
        repository.deleteById(id);
    }
}