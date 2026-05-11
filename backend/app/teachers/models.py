from uuid import UUID

from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class TeacherProfile(IdMixin, TimestampMixin, Base):
    __tablename__ = "teacher_profiles"

    user_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    employee_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(160), index=True)
    subjects: Mapped[list[str]] = mapped_column(JSON, default=list)
    phone: Mapped[str | None] = mapped_column(String(40))
    current_location: Mapped[str | None] = mapped_column(String(180))
    status: Mapped[str] = mapped_column(String(40), default="active")

