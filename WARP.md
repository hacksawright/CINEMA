# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview
Monorepo with a React SPA frontend (`frontend/`) and a Spring Boot backend packaged under `server/`. `server/docker-compose.yml` provisions MySQL for local dev. Backend source is currently distributed as `server/cinema-server.zip` and should be extracted to `server/cinema-server/` to run/build locally.

## Common Commands

### Frontend (Vite + React)
- Install deps:
  ```bash
  cd frontend && npm install
  ```
- Dev server (default port 8080):
  ```bash
  cd frontend && npm run dev
  ```
- Build and preview:
  ```bash
  cd frontend && npm run build && npm run preview
  ```
- Lint:
  ```bash
  cd frontend && npm run lint
  ```
- Tests: no frontend test runner is configured in this repo.

### Backend (Spring Boot + Maven)
- Start MySQL via Docker (DB: `cinema_db`, user `root` / password `password`):
  ```bash
  cd server && docker compose up -d
  ```
- Stop MySQL:
  ```bash
  cd server && docker compose down
  ```
- Extract backend source (first time):
  ```bash
  # Unzip server/cinema-server.zip so that sources reside in server/cinema-server/
  ```
- Run API:
  ```bash
  cd server/cinema-server && mvn spring-boot:run
  ```
- Build and tests:
  ```bash
  cd server/cinema-server && mvn clean package && mvn test
  ```
- Run a single test (example):
  ```bash
  cd server/cinema-server && mvn -Dtest=SomeTestClass#someMethod test
  ```

## Ports and Environment
- Both frontend and backend default to port 8080. Change one of them for concurrent dev:
  - Frontend port: edit `frontend/vite.config.js` → `server.port`.
  - Backend port: edit Spring `application.yml` in `server/cinema-server/src/main/resources/`.
- Backend DB credentials (overridable via env):
  - `DB_USERNAME` (default `root`)
  - `DB_PASSWORD` (default `password`)
  - JDBC URL default: `jdbc:mysql://localhost:3306/cinema_db`
- Frontend environment: Vite reads `VITE_*` variables (see `frontend/.env` if present) for integrations like Supabase.

## High-level Architecture
- Frontend SPA (Vite/React/Tailwind/shadcn):
  - Path alias `@/` → `frontend/src/` for imports (`@/components`, `@/lib`, `@/hooks`).
  - UI theming via CSS variables mapped in `tailwind.config.js` (use tokens, not hardcoded colors/border radii).
  - Many flows currently use mock data; integrate real API/Supabase by wiring fetchers and env vars.
- Backend (Spring Boot):
  - Flyway migrations run on startup to initialize schema (see `db/migration` in backend once extracted).
  - Health endpoints: `/api/health` and `/actuator/health`.
- Infra: `server/docker-compose.yml` brings up MySQL 8 on `localhost:3306` with a persistent volume.

## Notes for Agents
- Frontend code lives entirely in `frontend/`; the root `README.md` and `frontend/README.md` contain authoritative details on tech stack and conventions.
- If backend code is absent (only the ZIP is present), extract it before running Maven commands or editing backend sources.
