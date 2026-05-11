from datetime import time
from uuid import UUID

from sqlalchemy import ForeignKey, Integer, String, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class Classroom(IdMixin, TimestampMixin, Base):
    __tablename__ = "classrooms"

    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    capacity: Mapped[int] = mapped_column(Integer, default=30)
    building: Mapped[str | None] = mapped_column(String(120))


class ScheduleEntry(IdMixin, TimestampMixin, Base):
    __tablename__ = "schedule_entries"
    __table_args__ = (
        UniqueConstraint("class_name", "weekday", "starts_at", "ends_at", name="uq_class_slot"),
    )

    teacher_id: Mapped[UUID] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"), index=True)
    classroom_id: Mapped[UUID] = mapped_column(ForeignKey("classrooms.id", ondelete="CASCADE"), index=True)
    subject: Mapped[str] = mapped_column(String(120), index=True)
    class_name: Mapped[str] = mapped_column(String(80), index=True)
    weekday: Mapped[int] = mapped_column(Integer, index=True)
    starts_at: Mapped[time] = mapped_column(Time)
    ends_at: Mapped[time] = mapped_column(Time)

