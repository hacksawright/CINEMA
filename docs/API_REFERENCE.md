# 🔌 API Reference - Cinema Management System

## Base URL

```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Authentication

Hầu hết các API endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": "error",
  "timestamp": "2024-12-01T10:00:00"
}
```

## HTTP Status Codes

- `200 OK` - Request thành công
- `201 Created` - Tạo resource thành công
- `204 No Content` - Xóa thành công
- `400 Bad Request` - Request không hợp lệ
- `401 Unauthorized` - Chưa đăng nhập hoặc token không hợp lệ
- `403 Forbidden` - Không có quyền truy cập
- `404 Not Found` - Resource không tồn tại
- `500 Internal Server Error` - Lỗi server

---

## 🔐 Authentication APIs

### Register
Đăng ký tài khoản mới

**Endpoint:** `POST /api/auth/register`

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

**Errors:**
- `400` - Email đã tồn tại
- `400` - Validation error (email không hợp lệ, password quá ngắn, etc.)

---

### Login
Đăng nhập và nhận JWT token

**Endpoint:** `POST /api/auth/login`

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

**Errors:**
- `401` - Email hoặc password không đúng
- `400` - Missing required fields

---

## 🎬 Movie APIs

### Get All Movies
Lấy danh sách tất cả phim (có phân trang)

**Endpoint:** `GET /api/movies`

**Query Parameters:**
- `page` (optional): Số trang, default = 0
- `size` (optional): Số items mỗi trang, default = 20
- `sort` (optional): Sắp xếp, vd: `releaseDate,desc`

**Example:**
```
GET /api/movies?page=0&size=10&sort=releaseDate,desc
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "title": "Avengers: Endgame",
      "description": "After the devastating events...",
      "durationMinutes": 181,
      "rating": "PG-13",
      "releaseDate": "2024-01-15",
      "genre": "Action",
      "posterUrl": "https://example.com/poster.jpg",
      "status": "showing"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalPages": 5,
  "totalElements": 50,
  "last": false,
  "first": true
}
```

---

### Get Movie by ID
Lấy thông tin chi tiết một phim

**Endpoint:** `GET /api/movies/{id}`

**Path Parameters:**
- `id`: Movie ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Avengers: Endgame",
  "description": "After the devastating events...",
  "durationMinutes": 181,
  "rating": "PG-13",
  "releaseDate": "2024-01-15",
  "genre": "Action",
  "posterUrl": "https://example.com/poster.jpg",
  "status": "showing"
}
```

**Errors:**
- `404` - Movie not found

---

### Get Showing Movies
Lấy danh sách phim đang chiếu

**Endpoint:** `GET /api/movies/showing`

**Response:** `200 OK`
```json
[
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
]
```

---

### Get Upcoming Movies
Lấy danh sách phim sắp chiếu

**Endpoint:** `GET /api/movies/upcoming`

**Response:** `200 OK`
```json
[
  {
    "id": 2,
    "title": "Spider-Man: No Way Home",
    "description": "...",
    "durationMinutes": 148,
    "rating": "PG-13",
    "releaseDate": "2024-12-15",
    "genre": "Action",
    "posterUrl": "https://...",
    "status": "upcoming"
  }
]
```

---

### Search Movies
Tìm kiếm phim theo tiêu đề

**Endpoint:** `GET /api/movies/search`

**Query Parameters:**
- `title`: Tên phim cần tìm (required)

**Example:**
```
GET /api/movies/search?title=avengers
```

**Response:** `200 OK`
```json
[
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
]
```

---

### Create Movie (Admin)
Tạo phim mới

**Endpoint:** `POST /api/movies`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "title": "New Movie",
  "description": "Movie description",
  "durationMinutes": 120,
  "rating": "PG-13",
  "releaseDate": "2024-12-01",
  "genre": "Action",
  "posterUrl": "https://example.com/poster.jpg",
  "status": "upcoming"
}
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "title": "New Movie",
  "description": "Movie description",
  "durationMinutes": 120,
  "rating": "PG-13",
  "releaseDate": "2024-12-01",
  "genre": "Action",
  "posterUrl": "https://example.com/poster.jpg",
  "status": "upcoming"
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `durationMinutes`: Required, > 0
- `rating`: Optional, max 20 characters
- `status`: Must be one of: `showing`, `upcoming`, `ended`

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

### Update Movie (Admin)
Cập nhật thông tin phim

**Endpoint:** `PUT /api/movies/{id}`

**Authentication:** Required (Admin)

**Path Parameters:**
- `id`: Movie ID

**Request Body:**
```json
{
  "title": "Updated Movie Title",
  "description": "Updated description",
  "durationMinutes": 125,
  "rating": "PG-13",
  "releaseDate": "2024-12-01",
  "genre": "Action",
  "posterUrl": "https://example.com/new-poster.jpg",
  "status": "showing"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Movie Title",
  "description": "Updated description",
  "durationMinutes": 125,
  "rating": "PG-13",
  "releaseDate": "2024-12-01",
  "genre": "Action",
  "posterUrl": "https://example.com/new-poster.jpg",
  "status": "showing"
}
```

**Errors:**
- `404` - Movie not found
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden

---

### Delete Movie (Admin)
Xóa phim

**Endpoint:** `DELETE /api/movies/{id}`

**Authentication:** Required (Admin)

**Path Parameters:**
- `id`: Movie ID

**Response:** `204 No Content`

**Errors:**
- `404` - Movie not found
- `401` - Unauthorized
- `403` - Forbidden

---

## 🎭 Showtime APIs

### Get All Showtimes
Lấy danh sách suất chiếu (có phân trang)

**Endpoint:** `GET /api/showtimes`

**Query Parameters:**
- `page` (optional): Số trang, default = 0
- `size` (optional): Số items mỗi trang, default = 20

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "movieId": 1,
      "movieTitle": "Avengers: Endgame",
      "roomId": 1,
      "roomName": "Room 1",
      "startsAt": "2024-12-01T19:00:00",
      "endsAt": "2024-12-01T21:01:00",
      "basePrice": 120000
    }
  ],
  "totalPages": 3,
  "totalElements": 30
}
```

---

### Get Showtime by ID
Lấy thông tin chi tiết suất chiếu

**Endpoint:** `GET /api/showtimes/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "movieId": 1,
  "movieTitle": "Avengers: Endgame",
  "roomId": 1,
  "roomName": "Room 1",
  "startsAt": "2024-12-01T19:00:00",
  "endsAt": "2024-12-01T21:01:00",
  "basePrice": 120000
}
```

---

### Create Showtime (Admin)
Tạo suất chiếu mới

**Endpoint:** `POST /api/showtimes`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "movieId": 1,
  "roomId": 1,
  "startsAt": "2024-12-01T19:00:00",
  "endsAt": "2024-12-01T21:01:00",
  "basePrice": 120000
}
```

**Response:** `201 Created`
```json
{
  "id": 5,
  "movieId": 1,
  "movieTitle": "Avengers: Endgame",
  "roomId": 1,
  "roomName": "Room 1",
  "startsAt": "2024-12-01T19:00:00",
  "endsAt": "2024-12-01T21:01:00",
  "basePrice": 120000
}
```

**Validation:**
- `movieId`: Required, must exist
- `roomId`: Required, must exist
- `startsAt`: Required, must be future datetime
- `endsAt`: Required, must be after startsAt
- `basePrice`: Required, > 0

---

## 🎫 Booking APIs

### Get Showtime Seat Info
Lấy thông tin ghế của suất chiếu

**Endpoint:** `GET /api/booking/showtime/{showtimeId}/seats`

**Path Parameters:**
- `showtimeId`: Showtime ID

**Response:** `200 OK`
```json
{
  "showtimeId": 1,
  "movieTitle": "Avengers: Endgame",
  "roomName": "Room 1",
  "startsAt": "2024-12-01T19:00:00",
  "basePrice": 120000,
  "seats": [
    {
      "id": 1,
      "rowLabel": "A",
      "seatNumber": 1,
      "type": "STANDARD",
      "status": "AVAILABLE",
      "price": 120000
    },
    {
      "id": 2,
      "rowLabel": "A",
      "seatNumber": 2,
      "type": "VIP",
      "status": "BOOKED",
      "price": 150000
    }
  ]
}
```

**Seat Types:**
- `STANDARD`: Ghế thường
- `VIP`: Ghế VIP
- `COUPLE`: Ghế đôi
- `AISLE`: Lối đi (không đặt được)

**Seat Status:**
- `AVAILABLE`: Còn trống
- `BOOKED`: Đã đặt
- `SOLD`: Đã bán

---

### Create Booking
Đặt vé

**Endpoint:** `POST /api/booking`

**Authentication:** Required

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
  "status": "CONFIRMED",
  "seats": [
    {
      "rowLabel": "A",
      "seatNumber": 1,
      "type": "STANDARD",
      "price": 120000
    },
    {
      "rowLabel": "A",
      "seatNumber": 2,
      "type": "STANDARD",
      "price": 120000
    },
    {
      "rowLabel": "A",
      "seatNumber": 3,
      "type": "STANDARD",
      "price": 120000
    }
  ]
}
```

**Errors:**
- `400` - Ghế đã được đặt
- `400` - Suất chiếu không tồn tại
- `401` - Unauthorized

---

## 🏢 Room APIs

### Get All Rooms
Lấy danh sách phòng chiếu

**Endpoint:** `GET /api/rooms`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Room 1",
    "totalRows": 10,
    "seatsPerRow": 12
  }
]
```

---

## 👨‍💼 Admin APIs

### Get All Rooms (Admin)
**Endpoint:** `GET /api/admin/rooms`

**Authentication:** Required (Admin)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Room 1",
    "totalRows": 10,
    "seatsPerRow": 12,
    "totalSeats": 120
  }
]
```

---

### Create Room (Admin)
**Endpoint:** `POST /api/admin/rooms`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "Room 3",
  "totalRows": 8,
  "seatsPerRow": 10
}
```

**Response:** `201 Created`

---

### Get Room Layout (Admin)
**Endpoint:** `GET /api/admin/rooms/{roomId}/layout`

**Response:** `200 OK`
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

---

### Update Room Layout (Admin)
**Endpoint:** `PUT /api/admin/rooms/{roomId}/layout`

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
      "type": "VIP"
    }
  ]
}
```

---

### Get All Orders (Admin)
**Endpoint:** `GET /api/admin/orders`

**Authentication:** Required (Admin)

**Response:** `200 OK`
```json
[
  {
    "orderId": 1,
    "userId": 1,
    "userName": "Nguyen Van A",
    "totalAmount": 360000,
    "status": "CONFIRMED",
    "ticketCode": "TKT-20241201-001",
    "createdAt": "2024-12-01T10:00:00"
  }
]
```

---

### Get All Transactions (Admin)
**Endpoint:** `GET /api/admin/transactions`

**Authentication:** Required (Admin)

**Response:** `200 OK`
```json
[
  {
    "transactionId": 1,
    "orderId": 1,
    "amount": 360000,
    "paymentMethod": "CREDIT_CARD",
    "status": "SUCCESS",
    "createdAt": "2024-12-01T10:00:00"
  }
]
```

---

## 📝 Notes

- Tất cả datetime sử dụng format ISO 8601: `YYYY-MM-DDTHH:mm:ss`
- Tất cả số tiền (amount, price) là VND (đồng)
- Pagination bắt đầu từ page 0
- Default page size là 20 items

---

**Xem thêm:**
- [Backend Documentation](./BACKEND.md)
- [Database Schema](./DATABASE.md)

