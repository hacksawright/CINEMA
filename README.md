### 🎬 Cinema Management — Monorepo Frontend + Backend

Một hệ thống quản lý rạp chiếu phim bao gồm:
- Frontend: Vite + React + Tailwind + shadcn/ui (SPA)
- Backend: Spring Boot 3 (Java 21) + JPA + Flyway + MySQL 8
- Hỗ trợ Docker Compose để khởi chạy MySQL cục bộ

---

### 🔎 Mục lục
- Giới thiệu nhanh
- Kiến trúc & thư mục
- Công nghệ chính
- Thiết lập môi trường (lần đầu)
- Chạy dự án (cục bộ và với Docker)
- Cấu hình môi trường (.env / biến môi trường)
- API cơ bản và kiểm tra sức khỏe
- Quy ước UI/Frontend (tokens, shadcn/ui)
- Quy trình phát triển & tiêu chuẩn đóng góp
- Troubleshooting

---

### 📋 Giới thiệu nhanh
Ứng dụng cho phép người dùng xem phim, đặt vé; phía Admin quản lý phim, suất chiếu, ghế, đơn hàng và giao dịch. Frontend hiện có mô phỏng dữ liệu (mock) để phát triển UI nhanh chóng; Backend cung cấp API nền tảng, database khởi tạo bằng Flyway.

---

### 🧱 Kiến trúc & thư mục

```
cinema-management/
├── frontend/                         # Ứng dụng web (Vite + React + Tailwind + shadcn/ui)
│   ├── src/
│   │   ├── components/               # Building blocks; primitives ở components/ui
│   │   ├── pages/                    # Trang, bao gồm admin/*
│   │   ├── hooks/, lib/, assets/, integrations/supabase
│   │   └── index.css, main.jsx, App.jsx
│   ├── vite.config.js, tailwind.config.js, components.json
│   └── README.md                     # Tài liệu chi tiết Frontend
└── server/
    ├── docker-compose.yml            # MySQL 8 (3306), db: cinema_db
    ├── scripts/                      # start-db.sh, stop-db.sh, run-api.sh
    └── cinema-server/                # Spring Boot API
        ├── pom.xml
        └── src/main/
            ├── java/com/cinema/...   # Mã nguồn API
            └── resources/
                ├── application.yml   # Cấu hình Spring
                └── db/migration/     # Flyway (V1__init_schema.sql)
```

---

### 🚀 Công nghệ chính
- Frontend: React 18, Vite 5, React Router 6, Tailwind CSS 3, shadcn/ui, Radix UI, TanStack Query, React Hook Form + Zod, Lucide Icons
- Backend: Spring Boot 3.3, JPA/Hibernate, Flyway, Actuator, Validation, MySQL 8 driver
- Hạ tầng: Docker Compose (MySQL)

---

### 🧰 Thiết lập môi trường (lần đầu)

- Yêu cầu:
  - Node.js ≥ 18, npm hoặc yarn (Frontend)
  - Java 21, Maven 3.9+ (Backend)
  - Docker Desktop (tùy chọn, để chạy MySQL nhanh)

1) Cài đặt dependencies Frontend
```bash
cd frontend
npm install
# hoặc: yarn install
```

2) Chuẩn bị Database (khuyến nghị bằng Docker)
```bash
cd server
docker compose up -d
# hoặc dùng script tiện ích
./scripts/start-db.sh
```

3) Cấu hình Backend (tùy chọn vì đã có mặc định)
- File `server/cinema-server/src/main/resources/application.yml` sử dụng mặc định:
  - JDBC URL: `jdbc:mysql://localhost:3306/cinema_db`
  - `DB_USERNAME`: `root`
  - `DB_PASSWORD`: `password`

---

### ▶️ Chạy dự án

- Chạy Frontend (cổng 8080)
```bash
cd frontend
npm run dev
```
Truy cập: `http://localhost:8080`

- Chạy Backend API (cổng 8080)
```bash
cd server/cinema-server
mvn spring-boot:run
# hoặc dùng tiện ích
../scripts/run-api.sh
```

- Dừng Database Docker
```bash
cd server
docker compose down
# hoặc
./scripts/stop-db.sh
```

Ghi chú: Frontend và Backend mặc định cùng dùng cổng 8080 trong cấu hình hiện tại. Khi phát triển đồng thời, bạn có thể:
- Đổi cổng Frontend trong `frontend/vite.config.js` (ví dụ 5173) hoặc
- Đổi cổng Backend trong `server/cinema-server/src/main/resources/application.yml` (ví dụ 8081)

---

### 🔧 Cấu hình môi trường (.env / ENV)

Backend (Spring Boot) đọc biến môi trường qua `application.yml`:
- `DB_USERNAME` (mặc định: `root`)
- `DB_PASSWORD` (mặc định: `password`)
- JDBC URL cấu hình tại `spring.datasource.url` (mặc định `jdbc:mysql://localhost:3306/cinema_db`)

Ví dụ chạy API với biến môi trường tạm thời:
```bash
DB_USERNAME=myuser DB_PASSWORD=secret mvn spring-boot:run
```

Frontend hiện dùng mock data cho nhiều luồng, nên chưa yêu cầu `.env` bắt buộc. Nếu tích hợp Supabase/API thực, thêm `.env` theo nhu cầu và sử dụng alias `@/` để import.

---

### 🧪 API cơ bản và kiểm tra sức khỏe
- Health endpoint tùy chỉnh: `GET http://localhost:8080/api/health` → `{ "status": "UP" }`
- Spring Actuator (mặc định): `GET http://localhost:8080/actuator/health`
- Migrations: Flyway sẽ chạy `db/migration/V1__init_schema.sql` lần đầu để khởi tạo schema

---

### 🎨 Quy ước UI/Frontend
- Sử dụng tokens từ `frontend/src/index.css` và map qua `tailwind.config.js` (không hardcode màu/độ cong viền)
- Ưu tiên primitives từ `@/components/ui/*` (shadcn/ui) và gộp class bằng `cn` từ `@/lib/utils`
- Dark mode theo `class`, surfaces: `bg-card text-card-foreground` + `border border-border`
- Animations: dùng `animate-accordion-down` / `animate-accordion-up` qua data state
- Alias đường dẫn: `@/` → `src/`, kèm `@/components`, `@/lib`, `@/hooks`

---

### 🧭 Quy trình phát triển & đóng góp
1) Tạo nhánh: `git checkout -b feature/your-feature`
2) Code theo quy ước: đặt tên rõ ràng, tránh viết tắt; ưu tiên thành phần tái sử dụng
3) Chạy kiểm tra cục bộ:
```bash
# Frontend
cd frontend
npm run lint && npm run build

# Backend
cd ../server/cinema-server
mvn -q -DskipTests=false test
```
4) Commit ngắn gọn, rõ mục đích; Push và tạo Pull Request

---

### 🆘 Troubleshooting
- Không kết nối được DB MySQL:
  - Kiểm tra `docker compose ps` hoặc port 3306 bận
  - Đảm bảo `DB_USERNAME/DB_PASSWORD` khớp với docker-compose (`root/password`)
- Flyway lỗi migration:
  - Xem log ứng dụng; kiểm tra file `V1__init_schema.sql`
- Frontend không chạy đúng port:
  - Kiểm tra `frontend/vite.config.js` → `server.port`
- Module not found / alias sai:
  - Sử dụng alias `@/` thay vì đường dẫn tương đối sâu

---

### 📜 Giấy phép
Dự án phân phối theo MIT License (nếu không có file LICENSE, cân nhắc bổ sung).

---

### 👥 Liên hệ & ghi chú
- Dự án phục vụ mục đích học tập và demo nghiệp vụ rạp chiếu phim
- Mọi góp ý/issue vui lòng mở ở tab Issues của repository

