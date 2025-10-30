# 🗄️ Database Schema - Cinema Management System

## 📋 Tổng quan

Database sử dụng **MySQL 8.0** với **Flyway** để quản lý migration.

### Thông tin kết nối
- **Host**: localhost
- **Port**: 3307 (Docker container)
- **Database**: cinema_db
- **Username**: root
- **Password**: password

## 🏗️ Entity Relationship Diagram

```
┌──────────────┐
│    roles     │
└──────────────┘
       │
       │ 1:N
       ↓
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │──────<│   staffs     │       │    movies    │
└──────────────┘       └──────────────┘       └──────────────┘
       │                                              │
       │ 1:N                                          │ 1:N
       ↓                                              ↓
┌──────────────┐                              ┌──────────────┐
│    orders    │                              │  showtimes   │
└──────────────┘                              └──────────────┘
       │                                              │
       │ 1:1                                          │ N:1
       ↓                                              ↓
┌──────────────┐                              ┌──────────────┐
│ transactions │                              │    rooms     │
└──────────────┘                              └──────────────┘
                                                     │
       ┌─────────────────────────────────────────────┤
       │                                             │ 1:N
       │ N:N                                         ↓
       ↓                                      ┌──────────────┐
┌──────────────┐       ┌──────────────┐      │    seats     │
│order_tickets │──────<│   tickets    │<─────┘
└──────────────┘       └──────────────┘
```

## 📊 Tables

### 1. users
Bảng lưu thông tin người dùng (khách hàng và nhân viên)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | User ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email đăng nhập |
| password_hash | VARCHAR(255) | NOT NULL | Mật khẩu đã hash (BCrypt) |
| full_name | VARCHAR(255) | NOT NULL | Họ tên đầy đủ |
| phone | VARCHAR(30) | NULL | Số điện thoại |
| status | VARCHAR(30) | DEFAULT 'ACTIVE' | Trạng thái: ACTIVE, INACTIVE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (email)

**Sample Data:**
```sql
INSERT INTO users (email, password_hash, full_name, phone, status) VALUES
('admin@cinema.com', '$2a$10$...', 'Admin User', '0123456789', 'ACTIVE'),
('user@example.com', '$2a$10$...', 'Nguyen Van A', '0987654321', 'ACTIVE');
```

---

### 2. roles
Bảng phân quyền

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Role ID |
| code | VARCHAR(50) | NOT NULL, UNIQUE | Mã role: ADMIN, STAFF, CUSTOMER |
| name | VARCHAR(100) | NOT NULL | Tên role |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Sample Data:**
```sql
INSERT INTO roles (code, name) VALUES
('ADMIN', 'Administrator'),
('STAFF', 'Staff Member'),
('CUSTOMER', 'Customer');
```

---

### 3. staffs
Bảng nhân viên (liên kết users với roles)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Staff ID |
| user_id | BIGINT | NOT NULL, FK → users(id) | User ID |
| role_id | BIGINT | NOT NULL, FK → roles(id) | Role ID |
| started_at | DATE | NULL | Ngày bắt đầu làm việc |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_staff_user`: user_id → users(id)
- `fk_staff_role`: role_id → roles(id)

---

### 4. movies
Bảng phim

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Movie ID |
| title | VARCHAR(255) | NOT NULL | Tên phim |
| description | TEXT | NULL | Mô tả phim |
| duration_minutes | INT | NOT NULL | Thời lượng (phút) |
| rating | VARCHAR(20) | NULL | Phân loại: G, PG, PG-13, R, NC-17 |
| release_date | DATE | NULL | Ngày phát hành |
| genre | VARCHAR(100) | NULL | Thể loại: Action, Drama, Comedy, etc. |
| poster_url | VARCHAR(255) | NULL | URL poster |
| status | VARCHAR(50) | NULL | Trạng thái: showing, upcoming, ended |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- INDEX idx_status (status)
- INDEX idx_genre (genre)

**Sample Data:**
```sql
INSERT INTO movies (title, description, duration_minutes, rating, release_date, genre, poster_url, status) VALUES
('Avengers: Endgame', 'After the devastating events...', 181, 'PG-13', '2024-01-15', 'Action', 'https://...', 'showing'),
('Spider-Man: No Way Home', 'Peter Parker is unmasked...', 148, 'PG-13', '2024-12-15', 'Action', 'https://...', 'upcoming');
```

---

### 5. rooms
Bảng phòng chiếu

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Room ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Tên phòng: Room 1, Room 2, etc. |
| total_rows | INT | NOT NULL | Tổng số hàng ghế |
| seats_per_row | INT | NOT NULL | Số ghế mỗi hàng |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Calculated Fields:**
- Total capacity = total_rows × seats_per_row

**Sample Data:**
```sql
INSERT INTO rooms (name, total_rows, seats_per_row) VALUES
('Room 1', 10, 12),  -- 120 seats
('Room 2', 8, 10),   -- 80 seats
('Room 3', 12, 15);  -- 180 seats
```

---

### 6. seats
Bảng ghế ngồi

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Seat ID |
| room_id | BIGINT | NOT NULL, FK → rooms(id) | Room ID |
| row_label | VARCHAR(10) | NOT NULL | Nhãn hàng: A, B, C, ... |
| seat_number | INT | NOT NULL | Số ghế trong hàng: 1, 2, 3, ... |
| type | VARCHAR(30) | DEFAULT 'STANDARD' | Loại ghế: STANDARD, VIP, COUPLE, AISLE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_seat_room`: room_id → rooms(id) ON DELETE CASCADE

**Unique Constraint:**
- UNIQUE (room_id, row_label, seat_number)

**Seat Types:**
- `STANDARD`: Ghế thường (giá cơ bản)
- `VIP`: Ghế VIP (giá cao hơn 25%)
- `COUPLE`: Ghế đôi (giá cao hơn 50%)
- `AISLE`: Lối đi (không đặt được)

**Sample Data:**
```sql
-- Room 1, Row A
INSERT INTO seats (room_id, row_label, seat_number, type) VALUES
(1, 'A', 1, 'STANDARD'),
(1, 'A', 2, 'STANDARD'),
(1, 'A', 3, 'VIP'),
(1, 'A', 4, 'VIP');
```

---

### 7. showtimes
Bảng suất chiếu

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Showtime ID |
| movie_id | BIGINT | NOT NULL, FK → movies(id) | Movie ID |
| room_id | BIGINT | NOT NULL, FK → rooms(id) | Room ID |
| starts_at | DATETIME | NOT NULL | Thời gian bắt đầu |
| ends_at | DATETIME | NOT NULL | Thời gian kết thúc |
| base_price | DECIMAL(10,2) | NOT NULL | Giá vé cơ bản (VND) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_showtime_movie`: movie_id → movies(id)
- `fk_showtime_room`: room_id → rooms(id)

**Indexes:**
- INDEX idx_starts_at (starts_at)
- INDEX idx_movie_id (movie_id)

**Business Rules:**
- ends_at phải sau starts_at
- ends_at = starts_at + movie.duration_minutes
- Không được overlap với showtime khác trong cùng room

**Sample Data:**
```sql
INSERT INTO showtimes (movie_id, room_id, starts_at, ends_at, base_price) VALUES
(1, 1, '2024-12-01 19:00:00', '2024-12-01 21:01:00', 120000),
(1, 2, '2024-12-01 20:00:00', '2024-12-01 22:01:00', 120000),
(2, 1, '2024-12-02 19:00:00', '2024-12-02 21:28:00', 150000);
```

---

### 8. tickets
Bảng vé

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Ticket ID |
| showtime_id | BIGINT | NOT NULL, FK → showtimes(id) | Showtime ID |
| seat_id | BIGINT | NOT NULL, FK → seats(id) | Seat ID |
| price | DECIMAL(10,2) | NOT NULL | Giá vé (VND) |
| status | VARCHAR(30) | DEFAULT 'AVAILABLE' | Trạng thái: AVAILABLE, BOOKED, SOLD |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_ticket_showtime`: showtime_id → showtimes(id)
- `fk_ticket_seat`: seat_id → seats(id)

**Unique Constraint:**
- UNIQUE (showtime_id, seat_id) - Mỗi ghế chỉ có 1 vé cho 1 suất chiếu

**Ticket Status:**
- `AVAILABLE`: Vé còn trống, chưa ai đặt
- `BOOKED`: Đã đặt nhưng chưa thanh toán
- `SOLD`: Đã bán (đã thanh toán)

**Price Calculation:**
```
price = showtime.base_price × seat_type_multiplier

seat_type_multiplier:
- STANDARD: 1.0
- VIP: 1.25
- COUPLE: 1.5
```

---

### 9. orders
Bảng đơn hàng

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Order ID |
| user_id | BIGINT | NOT NULL, FK → users(id) | User ID |
| total_amount | DECIMAL(10,2) | NOT NULL | Tổng tiền (VND) |
| status | VARCHAR(30) | DEFAULT 'PENDING' | Trạng thái: PENDING, CONFIRMED, CANCELLED |
| ticket_code | VARCHAR(50) | UNIQUE | Mã vé: TKT-YYYYMMDD-XXX |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_order_user`: user_id → users(id)

**Indexes:**
- UNIQUE KEY (ticket_code)
- INDEX idx_user_id (user_id)
- INDEX idx_status (status)

**Order Status:**
- `PENDING`: Đang chờ thanh toán
- `CONFIRMED`: Đã xác nhận và thanh toán
- `CANCELLED`: Đã hủy

**Ticket Code Format:**
```
TKT-YYYYMMDD-XXX
TKT-20241201-001
TKT-20241201-002
```

---

### 10. order_tickets
Bảng liên kết Order và Ticket (Many-to-Many)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_id | BIGINT | PK, FK → orders(id) | Order ID |
| ticket_id | BIGINT | PK, FK → tickets(id) | Ticket ID |

**Primary Key:**
- COMPOSITE (order_id, ticket_id)

**Foreign Keys:**
- `fk_ot_order`: order_id → orders(id)
- `fk_ot_ticket`: ticket_id → tickets(id)

**Business Rules:**
- Một order có thể có nhiều tickets
- Một ticket chỉ thuộc về một order
- Khi tạo order, tickets status chuyển từ AVAILABLE → SOLD

---

### 11. transactions
Bảng giao dịch thanh toán

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Transaction ID |
| order_id | BIGINT | NOT NULL, FK → orders(id) | Order ID |
| amount | DECIMAL(10,2) | NOT NULL | Số tiền (VND) |
| payment_method | VARCHAR(50) | NULL | Phương thức: CASH, CREDIT_CARD, MOMO, VNPAY |
| status | VARCHAR(30) | DEFAULT 'PENDING' | Trạng thái: PENDING, SUCCESS, FAILED |
| transaction_code | VARCHAR(100) | UNIQUE | Mã giao dịch |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Ngày cập nhật |

**Foreign Keys:**
- `fk_transaction_order`: order_id → orders(id)

**Transaction Status:**
- `PENDING`: Đang xử lý
- `SUCCESS`: Thành công
- `FAILED`: Thất bại

**Payment Methods:**
- `CASH`: Tiền mặt
- `CREDIT_CARD`: Thẻ tín dụng
- `MOMO`: Ví MoMo
- `VNPAY`: VNPay

---

## 🔍 Common Queries

### Lấy danh sách phim đang chiếu
```sql
SELECT * FROM movies 
WHERE status = 'showing' 
ORDER BY release_date DESC;
```

### Lấy suất chiếu của một phim
```sql
SELECT s.*, m.title, r.name as room_name
FROM showtimes s
JOIN movies m ON s.movie_id = m.id
JOIN rooms r ON s.room_id = r.id
WHERE m.id = 1
  AND s.starts_at > NOW()
ORDER BY s.starts_at;
```

### Lấy ghế còn trống của suất chiếu
```sql
SELECT s.*, t.status
FROM seats s
JOIN tickets t ON t.seat_id = s.id
WHERE t.showtime_id = 1
  AND t.status = 'AVAILABLE'
  AND s.type != 'AISLE'
ORDER BY s.row_label, s.seat_number;
```

### Lấy đơn hàng của user
```sql
SELECT o.*, u.full_name, COUNT(ot.ticket_id) as ticket_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_tickets ot ON o.id = ot.order_id
WHERE u.id = 1
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### Thống kê doanh thu theo ngày
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_orders,
  SUM(total_amount) as revenue
FROM orders
WHERE status = 'CONFIRMED'
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🔐 Indexes & Performance

### Recommended Indexes
```sql
-- Movies
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_release_date ON movies(release_date);

-- Showtimes
CREATE INDEX idx_showtimes_starts_at ON showtimes(starts_at);
CREATE INDEX idx_showtimes_movie_id ON showtimes(movie_id);
CREATE INDEX idx_showtimes_room_id ON showtimes(room_id);

-- Tickets
CREATE INDEX idx_tickets_showtime_id ON tickets(showtime_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

## 📝 Migration Files

### V1__init_schema.sql
Tạo schema ban đầu với tất cả tables

### V2__add_movie_fields.sql
Thêm fields `genre`, `poster_url`, `status` vào table `movies`

### Future Migrations
- V3__add_user_roles.sql
- V4__add_promotions.sql
- V5__add_reviews.sql

---

**Xem thêm:**
- [Backend Documentation](./BACKEND.md)
- [API Reference](./API_REFERENCE.md)

