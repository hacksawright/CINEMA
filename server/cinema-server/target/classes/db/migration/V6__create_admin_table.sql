-- Tạo bảng admin cho hệ thống quản trị
CREATE TABLE IF NOT EXISTS admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Thêm tài khoản admin mặc định
INSERT INTO admin (username, password)
VALUES ('admin', 'admin123');
