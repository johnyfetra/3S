from datetime import date
from uuid import UUID

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class LogbookRecord(IdMixin, TimestampMixin, Base):
    __tablename__ = "logbook_records"

    teacher_id: Mapped[UUID] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"), index=True)
    entry_date: Mapped[date] = mapped_column(Date, index=True)
    subject: Mapped[str] = mapped_column(String(140), index=True)
    class_name: Mapped[str] = mapped_column(String(80), index=True)
    lesson_taught: Mapped[str] = mapped_column(String(220), index=True)
    homework: Mapped[str | None] = mapped_column(Text)
    attendance_count: Mapped[int] = mapped_column(Integer)
    remarks: Mapped[str | None] = mapped_column(Text)

