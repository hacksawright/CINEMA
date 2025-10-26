# Cinema Management Backend (Spring Boot)

## Prerequisites
- Java 21
- Maven 3.9+
- Docker (for MySQL) or local MySQL 8.x

## Start Database (Docker)
```bash
cd server
docker compose up -d
```

This creates database `cinema_db` with user `root` / password `password` on `localhost:3306`.

## Configure App
Defaults in `cinema-server/src/main/resources/application.yml`:
- `DB_USERNAME` default: `root`
- `DB_PASSWORD` default: `password`
- JDBC URL: `jdbc:mysql://localhost:3306/cinema_db`

You can override via environment variables when running.

## Run the API
```bash
cd server/cinema-server
mvn spring-boot:run
```

On first start, Flyway runs `db/migration/V1__init_schema.sql` to create tables.

## Verify
- App health: `http://localhost:8080/api/health`
- Actuator: `http://localhost:8080/actuator/health`

## Useful Commands
- Build: `mvn clean package`
- Tests: `mvn test`
- Stop DB: `docker compose down`

## Troubleshooting
- If port 3306 is busy, change the port in `server/docker-compose.yml`.
- If authentication fails, ensure env vars match the Docker DB credentials.
- If migrations fail, check application logs for Flyway errors.


