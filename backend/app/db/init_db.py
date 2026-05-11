from sqlalchemy import select
from app.admins.models import AdminProfile
from app.announcements.models import Announcement
from app.audit_logs.models import AuditLog
from app.auth.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.logbooks.models import LogbookRecord
from app.messaging.models import Conversation, Message
from app.notifications.models import Notification
from app.parents.models import ParentProfile
from app.preparation_cards.models import PreparationCard
from app.report_cards.models import ReportCard, ReportCardLine
from app.schedules.models import Classroom, ScheduleEntry
from app.security.rbac import Role
from app.students.models import Student
from app.teachers.models import TeacherProfile
from app.users.models import User


async def initialize_database() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.username == "superadmin"))
        if result.scalar_one_or_none():
            return

        session.add(
            User(
                username="superadmin",
                password_hash=hash_password("ChangeMe123!"),
                full_name="Super Administrator",
                role=Role.SUPER_ADMIN,
                force_password_reset=False,
            )
        )
        await session.commit()
