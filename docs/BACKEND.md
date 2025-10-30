# 🎬 Cinema Management - Backend Documentation

## 📋 Tổng quan

Backend của hệ thống Cinema Management được xây dựng bằng **Spring Boot 3.3.4** với **Java 21**, cung cấp RESTful API cho toàn bộ hệ thống quản lý rạp chiếu phim.

## 🏗️ Kiến trúc

### Tech Stack
- **Framework**: Spring Boot 3.3.4
- **Java Version**: 21
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA + Hibernate
- **Migration**: Flyway
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Server Port**: 8080
- **Database Port**: 3307 (Docker)

### Cấu trúc thư mục

```
server/cinema-server/
├── src/main/java/com/cinema/
│   ├── config/              # Cấu hình ứng dụng
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   ├── controller/          # REST Controllers
│   │   ├── admin/          # Admin controllers
│   │   │   ├── AdminOrderController.java
│   │   │   ├── AdminRoomController.java
│   │   │   └── AdminTransactionController.java
│   │   ├── AuthController.java
│   │   ├── BookingController.java
│   │   ├── MovieController.java
│   │   ├── RoomController.java
│   │   ├── ShowtimeController.java
│   │   └── StaffController.java
│   ├── dto/                # Data Transfer Objects
│   │   ├── BookingRequestDTO.java
│   │   ├── BookingResponseDTO.java
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── MovieRequest.java
│   │   ├── MovieResponse.java
│   │   ├── OrderDetailDTO.java
│   │   ├── OrderSummaryDTO.java
│   │   ├── RoomDTO.java
│   │   ├── RoomLayoutDTO.java
│   │   ├── SeatDTO.java
│   │   ├── ShowtimeDto.java
│   │   ├── ShowtimeSeatInfoDTO.java
│   │   └── TransactionDTO.java
│   ├── exception/          # Exception handlers
│   │   ├── GlobalExceptionHandler.java
│   │   ├── MovieNotFoundException.java
│   │   ├── ResourceNotFoundException.java
│   │   └── ...
│   ├── model/              # JPA Entities
│   │   ├── Movie.java
│   │   ├── Order.java
│   │   ├── Room.java
│   │   ├── Seat.java
│   │   ├── Showtime.java
│   │   ├── Staff.java
│   │   ├── Ticket.java
│   │   ├── Transaction.java
│   │   └── User.java
│   ├── repository/         # JPA Repositories
│   │   ├── MovieRepository.java
│   │   ├── OrderRepository.java
│   │   ├── RoomRepository.java
│   │   ├── SeatRepository.java
│   │   ├── ShowtimeRepository.java
│   │   ├── StaffRepository.java
│   │   ├── TicketRepository.java
│   │   ├── TransactionRepository.java
│   │   └── UserRepository.java
│   ├── service/            # Business Logic
│   │   ├── impl/          # Service implementations
│   │   ├── AuthService.java
│   │   ├── BookingService.java
│   │   ├── JwtTokenProvider.java
│   │   ├── MovieService.java
│   │   ├── OrderService.java
│   │   ├── RoomService.java
│   │   ├── ShowtimeService.java
│   │   ├── StaffService.java
│   │   └── TransactionService.java
│   └── CinemaServerApplication.java
├── src/main/resources/
│   ├── application.yml     # Cấu hình ứng dụng
│   └── db/migration/       # Flyway migrations
│       ├── V1__init_schema.sql
│       └── V2__add_movie_fields.sql
└── pom.xml                 # Maven dependencies
```

## 🗄️ Database Schema

### Entities và Relationships

#### 1. **User** (users)
- Quản lý thông tin người dùng
- Fields: id, email, passwordHash, fullName, phone, status
- Relationships: One-to-Many với Order, Staff

#### 2. **Movie** (movies)
- Quản lý thông tin phim
- Fields: id, title, description, durationMinutes, rating, releaseDate, genre, posterUrl, status
- Status: `showing`, `upcoming`, `ended`
- Relationships: One-to-Many với Showtime

#### 3. **Room** (rooms)
- Quản lý phòng chiếu
- Fields: id, name, totalRows, seatsPerRow
- Relationships: One-to-Many với Seat, Showtime

#### 4. **Seat** (seats)
- Quản lý ghế ngồi
- Fields: id, roomId, rowLabel, seatNumber, type
- Type: `STANDARD`, `VIP`, `COUPLE`, `AISLE`
- Relationships: Many-to-One với Room

#### 5. **Showtime** (showtimes)
- Quản lý suất chiếu
- Fields: id, movieId, roomId, startsAt, endsAt, basePrice
- Relationships: Many-to-One với Movie, Room; One-to-Many với Ticket

#### 6. **Ticket** (tickets)
- Quản lý vé
- Fields: id, showtimeId, seatId, price, status
- Status: `AVAILABLE`, `BOOKED`, `SOLD`
- Relationships: Many-to-One với Showtime, Seat

#### 7. **Order** (orders)
- Quản lý đơn hàng
- Fields: id, userId, totalAmount, status, ticketCode
- Status: `PENDING`, `CONFIRMED`, `CANCELLED`
- Relationships: Many-to-One với User; Many-to-Many với Ticket

#### 8. **Transaction** (transactions)
- Quản lý giao dịch thanh toán
- Fields: id, orderId, amount, paymentMethod, status
- Relationships: Many-to-One với Order

#### 9. **Staff** (staffs)
- Quản lý nhân viên
- Fields: id, userId, roleId, startedAt
- Relationships: Many-to-One với User

### Database Diagram

```
users ──┬─→ orders ──→ transactions
        │       ↓
        └─→ staffs    tickets ←─┬─ showtimes ←─┬─ movies
                         ↑      │               │
                         │      └─ rooms ───────┘
                         │           ↓
                         └────── seats
```

## 🔌 API Endpoints

### 1. Authentication (`/api/auth`)

#### POST `/api/auth/register`
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "phone": "0123456789"
}
```

**Response:** `201 Created`
```json
"Đăng ký thành công!"
```

#### POST `/api/auth/login`
Đăng nhập

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

### 2. Movies (`/api/movies`)

#### GET `/api/movies`
Lấy danh sách phim (có phân trang)

**Query Parameters:**
- `page`: Số trang (default: 0)
- `size`: Số phim mỗi trang (default: 20)
- `sort`: Sắp xếp (vd: `releaseDate,desc`)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "title": "Avengers: Endgame",
      "description": "...",
      "durationMinutes": 181,
      "rating": "PG-13",
      "releaseDate": "2024-01-15",
      "genre": "Action",
      "posterUrl": "https://...",
      "status": "showing"
    }
  ],
  "totalPages": 5,
  "totalElements": 100
}
```

#### GET `/api/movies/{id}`
Lấy thông tin chi tiết phim

**Response:** `200 OK`

#### GET `/api/movies/showing`
Lấy danh sách phim đang chiếu

#### GET `/api/movies/upcoming`
Lấy danh sách phim sắp chiếu

#### POST `/api/movies`
Tạo phim mới (Admin)

**Request Body:**
```json
{
  "title": "Movie Title",
  "description": "Description",
  "durationMinutes": 120,
  "rating": "PG-13",
  "releaseDate": "2024-12-01",
  "genre": "Action",
  "posterUrl": "https://...",
  "status": "upcoming"
}
```

#### PUT `/api/movies/{id}`
Cập nhật thông tin phim

#### DELETE `/api/movies/{id}`
Xóa phim

#### GET `/api/movies/search`
Tìm kiếm phim theo tiêu đề

**Query Parameters:**
- `title`: Tên phim cần tìm

### 3. Showtimes (`/api/showtimes`)

#### GET `/api/showtimes`
Lấy danh sách suất chiếu (có phân trang)

#### GET `/api/showtimes/{id}`
Lấy thông tin suất chiếu

#### POST `/api/showtimes`
Tạo suất chiếu mới

**Request Body:**
```json
{
  "movieId": 1,
  "roomId": 1,
  "startsAt": "2024-12-01T19:00:00",
  "endsAt": "2024-12-01T21:00:00",
  "basePrice": 120000
}
```

#### PUT `/api/showtimes/{id}`
Cập nhật suất chiếu

#### DELETE `/api/showtimes/{id}`
Xóa suất chiếu

### 4. Booking (`/api/booking`)

#### GET `/api/booking/showtime/{showtimeId}/seats`
Lấy thông tin ghế của suất chiếu

**Response:** `200 OK`
```json
{
  "showtimeId": 1,
  "movieTitle": "Avengers",
  "roomName": "Room 1",
  "startsAt": "2024-12-01T19:00:00",
  "seats": [
    {
      "id": 1,
      "rowLabel": "A",
      "seatNumber": 1,
      "type": "STANDARD",
      "status": "AVAILABLE",
      "price": 120000
    }
  ]
}
```

#### POST `/api/booking`
Tạo đơn đặt vé

**Request Body:**
```json
{
  "userId": 1,
  "showtimeId": 1,
  "seatIds": [1, 2, 3],
  "paymentMethod": "CREDIT_CARD"
}
```

**Response:** `200 OK`
```json
{
  "orderId": 123,
  "ticketCode": "TKT-20241201-123",
  "totalAmount": 360000,
  "status": "CONFIRMED"
}
```

### 5. Rooms (`/api/rooms`)

#### GET `/api/rooms`
Lấy danh sách phòng chiếu

#### POST `/api/rooms`
Tạo phòng chiếu mới

**Request Body:**
```json
{
  "name": "Room 1",
  "totalRows": 10,
  "seatsPerRow": 12
}
```

### 6. Admin - Rooms (`/api/admin/rooms`)

#### GET `/api/admin/rooms`
Lấy danh sách phòng (Admin)

#### GET `/api/admin/rooms/{roomId}`
Lấy thông tin phòng

#### POST `/api/admin/rooms`
Tạo phòng mới

#### PUT `/api/admin/rooms/{roomId}`
Cập nhật phòng

#### DELETE `/api/admin/rooms/{roomId}`
Xóa phòng

#### GET `/api/admin/rooms/{roomId}/layout`
Lấy sơ đồ ghế của phòng

#### PUT `/api/admin/rooms/{roomId}/layout`
Cập nhật sơ đồ ghế

**Request Body:**
```json
{
  "roomId": 1,
  "roomName": "Room 1",
  "totalRows": 10,
  "seatsPerRow": 12,
  "seats": [
    {
      "id": 1,
      "rowLabel": "A",
      "seatNumber": 1,
      "type": "STANDARD"
    }
  ]
}
```

### 7. Admin - Orders (`/api/admin/orders`)

#### GET `/api/admin/orders`
Lấy danh sách đơn hàng

#### GET `/api/admin/orders/{orderId}`
Lấy chi tiết đơn hàng

#### PUT `/api/admin/orders/{orderId}/status`
Cập nhật trạng thái đơn hàng

### 8. Admin - Transactions (`/api/admin/transactions`)

#### GET `/api/admin/transactions`
Lấy danh sách giao dịch

### 9. Staff (`/api/staff`)

#### GET `/api/staff`
Lấy danh sách nhân viên

#### POST `/api/staff`
Thêm nhân viên mới

## 🔐 Security & Authentication

### JWT Token
- Sử dụng JWT (JSON Web Token) cho authentication
- Token được trả về sau khi đăng nhập thành công
- Token phải được gửi trong header `Authorization: Bearer <token>` cho các API cần xác thực

### Spring Security Configuration
- CORS được cấu hình cho phép frontend (port 8081) truy cập
- Các endpoint public: `/api/auth/**`, `/api/movies/**` (GET)
- Các endpoint cần authentication: `/api/booking/**`, `/api/admin/**`

## 📦 Dependencies chính

```xml
<!-- Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL Driver -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<!-- Flyway Migration -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

**Xem thêm:**
- [Hướng dẫn cài đặt Backend](./BACKEND_SETUP.md)
- [API Reference chi tiết](./API_REFERENCE.md)
- [Database Schema](./DATABASE.md)

