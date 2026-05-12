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

Frontend: `http://localhost:3001`

Backend health: `http://localhost:8001/health`

## Demo Accounts

| Role | Username | Password | What to test |
| --- | --- | --- | --- |
| Super Admin | `superadmin` | `ChangeMe123!` | Global administration, monitoring, all CRUD APIs |
| Admin | `admin.school` | `Admin123!` | School operations, classes, teachers, subjects, schedules |
| Teacher | `teacher.john` | `Teacher123!` | Multiple classes/subjects, grade entry |
| Teacher | `teacher.marie` | `Teacher123!` | Shared class subjects and responsible class |
| Teacher | `teacher.andry` | `Teacher123!` | Additional teacher assignments |
| Parent | `parent.demo` | `Parent123!` | Parent portal and linked children data |

## Seeded ERP Data

The backend startup seeds realistic demo data idempotently:

- 7 users across super admin, admin, teacher, and parent roles.
- 3 teacher profiles.
- 3 school classes: `8e`, `9e`, `10e`.
- 10 subjects including Malagasy, French, English, Maths, PC, SVT, INFO, EPS.
- 8 teaching assignments covering multiple teachers, classes, and subjects.
- 7 students, including parent-linked children.
- sample grade entries for Bimester 1.
- 4 classrooms and 4 timetable slots.
- one announcement and one messaging conversation.

## CRUD/API Smoke Tests

After `docker compose up --build`, test with:

```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"ChangeMe123!"}'
```

Core CRUD endpoints:

- `/api/v1/users`
- `/api/v1/teachers`
- `/api/v1/students`
- `/api/v1/academic/classes`
- `/api/v1/academic/subjects`
- `/api/v1/academic/assignments`
- `/api/v1/classrooms`
- `/api/v1/schedules`

Teacher grade-entry endpoints:

- `GET /api/v1/teacher-workspace/me`
- `GET /api/v1/teacher-workspace/grades?assignment_id=...&bimester=1`
- `POST /api/v1/teacher-workspace/grades`

## Development Notes

This is an enterprise scaffold with functional school operations. The next production steps are:

- Add initial Alembic migration and seed super-admin command.
- Add dedicated UI edit forms for every CRUD list, beyond the current API CRUD and creation dashboards.
- Add Redis-backed Socket.IO or a pure WebSocket client/server contract.
- Add test suites for auth, RBAC, report-card calculations, timetable conflicts, and academic validation.
- Add CI checks for linting, type checking, tests, Docker builds, and migration validation.
