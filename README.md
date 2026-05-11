# Enterprise School Management ERP

This repository is now structured as a production-oriented full-stack School ERP monorepo.

## Architecture

- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts, Socket.IO client dependency.
- `backend/`: FastAPI async backend, SQLAlchemy async ORM, JWT auth, RBAC, repositories, services, domain modules, WebSocket presence.
- `docker-compose.yml`: PostgreSQL, Redis, backend, and frontend services.

## Implemented Foundations

- Premium animated landing page with login, contact, learn-more CTAs.
- Username/password authentication flow. No email login.
- Centralized RBAC model for super admin, admin, teacher, and parent permissions.
- Async backend app factory, config, logging, exceptions, repositories, and services.
- Report-card calculation domain with five-bimester-ready academic modeling.
- Preparation card, logbook, smart timetable, and academic validation domain boundaries.
- Realtime presence connection manager and monitoring UI.
- Role-specific frontend surfaces for super admin, admin, teacher, parent, messaging, report cards, and timetable.

## Run Locally

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Backend health: `http://localhost:8000/health`

## Development Notes

This is a strong enterprise scaffold rather than a finished deployment. The next production steps are:

- Add initial Alembic migration and seed super-admin command.
- Expand CRUD routers for students, teachers, parents, preparation cards, logbooks, schedules, report cards, messages, announcements, and audit logs.
- Add Redis-backed Socket.IO or a pure WebSocket client/server contract.
- Add test suites for auth, RBAC, report-card calculations, timetable conflicts, and academic validation.
- Add CI checks for linting, type checking, tests, Docker builds, and migration validation.

