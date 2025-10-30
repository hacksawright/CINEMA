# 🎬 Cinema Management System - Documentation

## 📋 Tổng quan dự án

**Cinema Management System** là một hệ thống quản lý rạp chiếu phim toàn diện, được xây dựng với kiến trúc **Full-stack Modern Web Application**.

### Mục đích
- Quản lý phim, suất chiếu, phòng chiếu, ghế ngồi
- Đặt vé trực tuyến cho khách hàng
- Quản lý đơn hàng và giao dịch
- Quản lý nhân viên và phân quyền
- Báo cáo và thống kê doanh thu

### Đối tượng sử dụng
- **Khách hàng**: Xem phim, đặt vé, quản lý đơn hàng
- **Quản trị viên**: Quản lý toàn bộ hệ thống
- **Nhân viên**: Hỗ trợ khách hàng, xử lý đơn hàng

## 🏗️ Kiến trúc hệ thống

### Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (SPA)                       │
│  React 18 + Vite + Tailwind CSS + shadcn/ui            │
│  Port: 8081                                             │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (REST API)                     │
│  Spring Boot 3 + Java 21 + Spring Security + JWT       │
│  Port: 8080                                             │
└─────────────────────────────────────────────────────────┘
                          ↕ JDBC
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                             │
│  MySQL 8.0 (Docker Container)                           │
│  Port: 3307                                             │
└─────────────────────────────────────────────────────────┘
```

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM 6.30.1
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios + Fetch API

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0
- **Migration**: Flyway
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

### Database
- **RDBMS**: MySQL 8.0
- **Container**: Docker + Docker Compose
- **Migration Tool**: Flyway

## 📁 Cấu trúc dự án

```
cinema-management/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                   # Backend Application
│   ├── cinema-server/
│   │   ├── src/main/java/com/cinema/
│   │   │   ├── config/      # Configuration classes
│   │   │   ├── controller/  # REST Controllers
│   │   │   ├── service/     # Business logic
│   │   │   ├── repository/  # Data access layer
│   │   │   ├── model/       # JPA Entities
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   └── exception/   # Exception handlers
│   │   ├── src/main/resources/
│   │   │   ├── application.yml
│   │   │   └── db/migration/  # Flyway migrations
│   │   └── pom.xml
│   └── docker-compose.yml   # MySQL container config
│
├── docs/                     # Documentation
│   ├── README.md            # This file
│   ├── BACKEND.md           # Backend documentation
│   ├── BACKEND_SETUP.md     # Backend setup guide
│   ├── FRONTEND.md          # Frontend documentation
│   ├── FRONTEND_SETUP.md    # Frontend setup guide
│   ├── API_REFERENCE.md     # API documentation
│   └── DATABASE.md          # Database schema
│
└── README.md                # Project overview
```

## 🚀 Quick Start

### Yêu cầu hệ thống
- **Java**: JDK 21+
- **Node.js**: 18.x hoặc 20.x
- **Docker**: Latest version
- **Maven**: 3.6+ (hoặc dùng Maven Wrapper)

### Cài đặt nhanh

#### 1. Clone repository
```bash
git clone <repository-url>
cd cinema-management
```

#### 2. Khởi động Database
```bash
cd server
docker-compose up -d
```

#### 3. Chạy Backend
```bash
cd server/cinema-server
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

#### 4. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:8081**

#### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: **http://localhost:8081**

## 📚 Tài liệu chi tiết

### Hướng dẫn cài đặt
- [**Backend Setup Guide**](./BACKEND_SETUP.md) - Hướng dẫn cài đặt và cấu hình backend
- [**Frontend Setup Guide**](./FRONTEND_SETUP.md) - Hướng dẫn cài đặt và cấu hình frontend

### Tài liệu kỹ thuật
- [**Backend Documentation**](./BACKEND.md) - Kiến trúc, modules, services, APIs
- [**Frontend Documentation**](./FRONTEND.md) - Components, pages, routing, state management
- [**API Reference**](./API_REFERENCE.md) - Chi tiết tất cả API endpoints
- [**Database Schema**](./DATABASE.md) - Cấu trúc database, entities, relationships

## 🎯 Chức năng chính

### Khách hàng (Customer)
- ✅ Xem danh sách phim (đang chiếu, sắp chiếu)
- ✅ Xem chi tiết phim (thông tin, trailer, lịch chiếu)
- ✅ Đặt vé trực tuyến
- ✅ Chọn ghế ngồi (Standard, VIP, Couple)
- ✅ Thanh toán và nhận mã vé
- ✅ Xem lịch sử đặt vé
- ✅ Quản lý tài khoản

### Quản trị viên (Admin)
- ✅ **Quản lý phim**: Thêm, sửa, xóa phim
- ✅ **Quản lý suất chiếu**: Tạo lịch chiếu, phân phòng
- ✅ **Quản lý phòng chiếu**: Tạo phòng, cấu hình sơ đồ ghế
- ✅ **Quản lý ghế ngồi**: Thiết kế layout ghế, phân loại ghế
- ✅ **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng
- ✅ **Quản lý giao dịch**: Theo dõi thanh toán, doanh thu
- ✅ **Quản lý nhân viên**: Thêm, sửa, xóa nhân viên
- ✅ **Dashboard**: Thống kê tổng quan, báo cáo

## 🗄️ Database Schema

### Core Entities

```
┌─────────┐       ┌─────────┐       ┌──────────────┐
│  User   │──────<│  Order  │>──────│ Transaction  │
└─────────┘       └─────────┘       └──────────────┘
     │                 │
     │                 │
     ↓                 ↓
┌─────────┐       ┌─────────┐
│  Staff  │       │ Ticket  │
└─────────┘       └─────────┘
                       │
                       ↓
                  ┌──────────┐       ┌─────────┐
                  │ Showtime │──────<│  Movie  │
                  └──────────┘       └─────────┘
                       │
                       ↓
                  ┌─────────┐       ┌─────────┐
                  │  Room   │──────<│  Seat   │
                  └─────────┘       └─────────┘
```

### Main Tables
- **users**: Thông tin người dùng
- **movies**: Thông tin phim
- **rooms**: Phòng chiếu
- **seats**: Ghế ngồi
- **showtimes**: Suất chiếu
- **tickets**: Vé
- **orders**: Đơn hàng
- **transactions**: Giao dịch thanh toán
- **staffs**: Nhân viên

Xem chi tiết: [Database Documentation](./DATABASE.md)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### Movies
- `GET /api/movies` - Lấy danh sách phim
- `GET /api/movies/{id}` - Chi tiết phim
- `GET /api/movies/showing` - Phim đang chiếu
- `GET /api/movies/upcoming` - Phim sắp chiếu
- `POST /api/movies` - Tạo phim mới (Admin)
- `PUT /api/movies/{id}` - Cập nhật phim (Admin)
- `DELETE /api/movies/{id}` - Xóa phim (Admin)

### Showtimes
- `GET /api/showtimes` - Danh sách suất chiếu
- `GET /api/showtimes/{id}` - Chi tiết suất chiếu
- `POST /api/showtimes` - Tạo suất chiếu (Admin)
- `PUT /api/showtimes/{id}` - Cập nhật suất chiếu (Admin)
- `DELETE /api/showtimes/{id}` - Xóa suất chiếu (Admin)

### Booking
- `GET /api/booking/showtime/{id}/seats` - Lấy thông tin ghế
- `POST /api/booking` - Đặt vé

### Admin
- `GET /api/admin/rooms` - Quản lý phòng
- `GET /api/admin/orders` - Quản lý đơn hàng
- `GET /api/admin/transactions` - Quản lý giao dịch

Xem chi tiết: [API Reference](./API_REFERENCE.md)

## 🔐 Authentication & Security

### JWT Authentication
- Sử dụng JWT (JSON Web Token) cho authentication
- Token được lưu trong localStorage
- Token có thời hạn 24 giờ
- Tự động refresh khi hết hạn

### Security Features
- Password hashing với BCrypt
- CORS configuration
- SQL Injection prevention (JPA/Hibernate)
- XSS protection
- CSRF protection

### Authorization
- Role-based access control (RBAC)
- Admin routes protected
- API endpoints protected với JWT

## 🎨 UI/UX Features

### Design System
- **Dark Cinema Theme**: Giao diện tối chủ đạo
- **Responsive Design**: Hỗ trợ mobile, tablet, desktop
- **Modern UI**: shadcn/ui components
- **Smooth Animations**: Tailwind CSS animations
- **Accessibility**: ARIA labels, keyboard navigation

### User Experience
- **Fast Loading**: Vite HMR, code splitting
- **Optimistic Updates**: TanStack Query
- **Error Handling**: Toast notifications
- **Loading States**: Skeleton screens
- **Form Validation**: Real-time validation với Zod

## 🧪 Testing

### Backend Testing
```bash
cd server/cinema-server
mvn test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

### API Testing
Sử dụng Postman, curl, hoặc REST Client extension.

## 📊 Monitoring & Logging

### Backend Monitoring
- Spring Boot Actuator endpoints
- Health check: `http://localhost:8080/actuator/health`
- Application info: `http://localhost:8080/actuator/info`

### Logging
- Backend: SLF4J + Logback
- Frontend: Console logging (development)
- Database: MySQL slow query log

## 🚀 Deployment

### Development
```bash
# Backend
cd server/cinema-server
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

### Production Build

**Backend:**
```bash
cd server/cinema-server
mvn clean package
java -jar target/cinema-server-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

### Docker Deployment
```bash
# Build images
docker build -t cinema-backend ./server/cinema-server
docker build -t cinema-frontend ./frontend

# Run with docker-compose
docker-compose up -d
```

## 🐛 Troubleshooting

### Common Issues

**Backend không kết nối được database:**
- Kiểm tra MySQL container: `docker ps`
- Kiểm tra port 3307: `netstat -an | grep 3307`
- Xem logs: `docker logs cinema_mysql`

**Frontend không gọi được API:**
- Kiểm tra backend đang chạy: `curl http://localhost:8080/actuator/health`
- Kiểm tra CORS configuration
- Xem Network tab trong DevTools

**Port conflict:**
- Backend (8080): Thay đổi trong `application.yml`
- Frontend (8081): Thay đổi trong `vite.config.js`
- Database (3307): Thay đổi trong `docker-compose.yml`

Xem thêm:
- [Backend Troubleshooting](./BACKEND_SETUP.md#troubleshooting)
- [Frontend Troubleshooting](./FRONTEND_SETUP.md#troubleshooting)

## 📖 Learning Resources

### Technologies
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

### Tutorials
- [Spring Boot REST API Tutorial](https://spring.io/guides/tutorials/rest/)
- [React Tutorial](https://react.dev/learn)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs)

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- **Backend**: Follow Java Code Conventions
- **Frontend**: ESLint + Prettier
- **Commits**: Conventional Commits

## 📝 License

This project is for educational purposes.

## 👥 Team

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **Database Designer**: [Your Name]

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting](#troubleshooting)
2. Xem [Documentation](#-tài-liệu-chi-tiết)
3. Tạo Issue trên GitHub

---

**Happy Coding! 🎬🍿**

