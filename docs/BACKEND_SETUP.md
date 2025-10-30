# 🚀 Hướng dẫn cài đặt Backend - Cinema Management

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết
- **Java Development Kit (JDK)**: Version 21 trở lên
- **Maven**: Version 3.6+ (hoặc sử dụng Maven Wrapper đi kèm)
- **Docker & Docker Compose**: Để chạy MySQL database
- **IDE**: IntelliJ IDEA, Eclipse, hoặc VS Code với Java Extension Pack

### Kiểm tra phiên bản

```bash
# Kiểm tra Java version
java -version
# Output mong đợi: openjdk version "21.x.x"

# Kiểm tra Maven version
mvn -version
# Output mong đợi: Apache Maven 3.x.x

# Kiểm tra Docker
docker --version
docker-compose --version
```

## 🔧 Cài đặt từng bước

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd cinema-management/server
```

### Bước 2: Khởi động MySQL Database với Docker

```bash
# Di chuyển vào thư mục server
cd server

# Khởi động MySQL container
docker-compose up -d

# Kiểm tra container đang chạy
docker ps
```

**Thông tin Database:**
- Host: `localhost`
- Port: `3307` (mapped từ 3306 trong container)
- Database: `cinema_db`
- Username: `root`
- Password: `password`

**Lưu ý:** Port 3307 được sử dụng để tránh conflict với MySQL đã cài sẵn trên máy (thường dùng port 3306).

### Bước 3: Cấu hình application.yml

File cấu hình nằm tại: `server/cinema-server/src/main/resources/application.yml`

```yaml
spring:
  application:
    name: cinema-server
  datasource:
    url: jdbc:mysql://localhost:3307/cinema_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate  # Không tự động tạo/sửa schema, dùng Flyway
    properties:
      hibernate:
        format_sql: true
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

server:
  port: 8080

logging:
  level:
    org.hibernate.SQL: debug
    org.hibernate.orm.jdbc.bind: trace
```

**Giải thích cấu hình:**
- `ddl-auto: validate`: Hibernate chỉ validate schema, không tự động tạo/sửa
- `flyway.enabled: true`: Sử dụng Flyway để quản lý database migration
- `baseline-on-migrate: true`: Tự động baseline nếu database đã có data
- `server.port: 8080`: Backend chạy trên port 8080

### Bước 4: Build project

```bash
# Di chuyển vào thư mục cinema-server
cd cinema-server

# Build với Maven
mvn clean install

# Hoặc sử dụng Maven Wrapper (không cần cài Maven)
./mvnw clean install  # Linux/Mac
mvnw.cmd clean install  # Windows
```

**Lưu ý:** Lần build đầu tiên sẽ mất thời gian để download dependencies.

### Bước 5: Chạy ứng dụng

#### Cách 1: Sử dụng Maven

```bash
mvn spring-boot:run

# Hoặc với Maven Wrapper
./mvnw spring-boot:run  # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

#### Cách 2: Chạy file JAR

```bash
# Build JAR file
mvn clean package

# Chạy JAR
java -jar target/cinema-server-0.0.1-SNAPSHOT.jar
```

#### Cách 3: Chạy từ IDE

**IntelliJ IDEA:**
1. Mở project `cinema-server`
2. Tìm file `CinemaServerApplication.java`
3. Click chuột phải → Run 'CinemaServerApplication'

**VS Code:**
1. Mở project `cinema-server`
2. Cài extension "Spring Boot Extension Pack"
3. Nhấn F5 hoặc Run → Start Debugging

### Bước 6: Kiểm tra ứng dụng đã chạy

```bash
# Kiểm tra health endpoint
curl http://localhost:8080/actuator/health

# Output mong đợi:
# {"status":"UP"}
```

Hoặc mở trình duyệt và truy cập:
- Health check: http://localhost:8080/actuator/health
- API Movies: http://localhost:8080/api/movies

## 🗄️ Database Migration với Flyway

### Cách hoạt động

Flyway tự động chạy các file migration khi ứng dụng khởi động:

```
src/main/resources/db/migration/
├── V1__init_schema.sql       # Tạo schema ban đầu
├── V2__add_movie_fields.sql  # Thêm fields cho Movie
└── V3__...sql                # Các migration tiếp theo
```

### Quy tắc đặt tên migration

- Format: `V{version}__{description}.sql`
- Version: Số tăng dần (V1, V2, V3, ...)
- Description: Mô tả ngắn gọn, dùng underscore thay space
- Ví dụ: `V3__add_user_roles.sql`

### Tạo migration mới

1. Tạo file mới trong `src/main/resources/db/migration/`
2. Đặt tên theo format `V{next_version}__{description}.sql`
3. Viết SQL script
4. Restart ứng dụng, Flyway sẽ tự động chạy migration

**Ví dụ migration:**

```sql
-- V3__add_user_roles.sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

ALTER TABLE users ADD COLUMN role_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_user_role 
    FOREIGN KEY (role_id) REFERENCES roles(id);
```

### Kiểm tra migration history

```bash
# Kết nối vào MySQL container
docker exec -it cinema_mysql mysql -uroot -ppassword cinema_db

# Xem lịch sử migration
SELECT * FROM flyway_schema_history;
```

## 🔧 Cấu hình nâng cao

### Sử dụng biến môi trường

Thay vì hardcode password trong `application.yml`, sử dụng environment variables:

```bash
# Linux/Mac
export DB_USERNAME=root
export DB_PASSWORD=your_password

# Windows (CMD)
set DB_USERNAME=root
set DB_PASSWORD=your_password

# Windows (PowerShell)
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"
```

### Cấu hình JWT Secret

Thêm vào `application.yml`:

```yaml
jwt:
  secret: ${JWT_SECRET:your-secret-key-here-change-in-production}
  expiration: 86400000  # 24 hours in milliseconds
```

### Cấu hình CORS

File: `src/main/java/com/cinema/config/WebConfig.java`

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8081")  // Frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to database"

**Nguyên nhân:** MySQL container chưa chạy hoặc port bị conflict

**Giải pháp:**
```bash
# Kiểm tra container
docker ps

# Nếu không thấy container, khởi động lại
docker-compose down
docker-compose up -d

# Kiểm tra logs
docker logs cinema_mysql
```

### Lỗi: "Port 8080 already in use"

**Nguyên nhân:** Port 8080 đã được sử dụng bởi ứng dụng khác

**Giải pháp 1:** Thay đổi port trong `application.yml`
```yaml
server:
  port: 8081  # Hoặc port khác
```

**Giải pháp 2:** Tìm và kill process đang dùng port 8080
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Lỗi: "Flyway migration failed"

**Nguyên nhân:** Migration script có lỗi hoặc đã chạy một phần

**Giải pháp:**
```bash
# Kết nối vào database
docker exec -it cinema_mysql mysql -uroot -ppassword cinema_db

# Xem lịch sử migration
SELECT * FROM flyway_schema_history;

# Nếu cần reset database (CHÚ Ý: Mất hết data)
DROP DATABASE cinema_db;
CREATE DATABASE cinema_db;
```

### Lỗi: "Java version mismatch"

**Nguyên nhân:** JDK version không đúng

**Giải pháp:**
```bash
# Kiểm tra Java version
java -version

# Nếu sai version, cài JDK 21
# Download từ: https://adoptium.net/
```

### Lỗi: "Maven build failed"

**Nguyên nhân:** Dependencies không download được hoặc code có lỗi

**Giải pháp:**
```bash
# Xóa cache Maven và build lại
mvn clean
rm -rf ~/.m2/repository  # Linux/Mac
# hoặc xóa thủ công folder C:\Users\<username>\.m2\repository (Windows)

mvn clean install -U  # -U force update dependencies
```

## 📊 Monitoring & Logging

### Spring Boot Actuator

Các endpoint monitoring:
- Health: http://localhost:8080/actuator/health
- Info: http://localhost:8080/actuator/info

### Xem logs

```bash
# Logs của ứng dụng Spring Boot
# Logs sẽ hiển thị trên console khi chạy

# Logs của MySQL container
docker logs cinema_mysql

# Follow logs real-time
docker logs -f cinema_mysql
```

### Cấu hình log level

Trong `application.yml`:

```yaml
logging:
  level:
    root: INFO
    com.cinema: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.orm.jdbc.bind: TRACE
  file:
    name: logs/cinema-server.log
```

## 🧪 Testing

### Chạy unit tests

```bash
mvn test
```

### Chạy integration tests

```bash
mvn verify
```

### Test API với curl

```bash
# Test đăng ký
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "0123456789"
  }'

# Test đăng nhập
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test lấy danh sách phim
curl http://localhost:8080/api/movies
```

## 🔄 Development Workflow

### Hot reload với Spring Boot DevTools

Thêm dependency vào `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

Khi code thay đổi, ứng dụng sẽ tự động restart.

### Debug mode

```bash
# Chạy với debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

Sau đó attach debugger từ IDE vào port 5005.

## 📚 Tài liệu tham khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)

---

**Tiếp theo:** [API Reference](./API_REFERENCE.md) | [Frontend Setup](./FRONTEND_SETUP.md)

