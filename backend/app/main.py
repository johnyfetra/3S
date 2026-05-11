from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.admins.router import router as admins_router
from app.announcements.router import router as announcements_router
from app.audit_logs.router import router as audit_logs_router
from app.auth.router import router as auth_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.db.init_db import initialize_database
from app.logbooks.router import router as logbooks_router
from app.messaging.router import conversations_router, messages_router
from app.notifications.router import router as notifications_router
from app.parents.router import router as parents_router
from app.preparation_cards.router import router as preparation_cards_router
from app.realtime.router import router as realtime_router
from app.report_cards.router import report_card_lines_router, report_cards_router
from app.schedules.router import classrooms_router, schedule_router
from app.students.router import router as students_router
from app.teachers.router import router as teachers_router
from app.users.router import router as users_router


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_exception_handlers(app)
    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    app.include_router(users_router, prefix=settings.api_v1_prefix)
    app.include_router(students_router, prefix=settings.api_v1_prefix)
    app.include_router(teachers_router, prefix=settings.api_v1_prefix)
    app.include_router(parents_router, prefix=settings.api_v1_prefix)
    app.include_router(admins_router, prefix=settings.api_v1_prefix)
    app.include_router(classrooms_router, prefix=settings.api_v1_prefix)
    app.include_router(schedule_router, prefix=settings.api_v1_prefix)
    app.include_router(conversations_router, prefix=settings.api_v1_prefix)
    app.include_router(messages_router, prefix=settings.api_v1_prefix)
    app.include_router(announcements_router, prefix=settings.api_v1_prefix)
    app.include_router(report_cards_router, prefix=settings.api_v1_prefix)
    app.include_router(report_card_lines_router, prefix=settings.api_v1_prefix)
    app.include_router(preparation_cards_router, prefix=settings.api_v1_prefix)
    app.include_router(logbooks_router, prefix=settings.api_v1_prefix)
    app.include_router(notifications_router, prefix=settings.api_v1_prefix)
    app.include_router(audit_logs_router, prefix=settings.api_v1_prefix)
    app.include_router(realtime_router, prefix=settings.api_v1_prefix)

    @app.on_event("startup")
    async def startup() -> None:
        await initialize_database()

    @app.get("/health", tags=["system"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
