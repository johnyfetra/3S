from uuid import UUID

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class PreparationCard(IdMixin, TimestampMixin, Base):
    __tablename__ = "preparation_cards"

    teacher_id: Mapped[UUID] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"), index=True)
    academic_year: Mapped[str] = mapped_column(String(20), index=True)
    subject: Mapped[str] = mapped_column(String(140), index=True)
    class_name: Mapped[str] = mapped_column(String(80), index=True)
    bimester: Mapped[int] = mapped_column(Integer, index=True)
    lesson_title: Mapped[str] = mapped_column(String(220), index=True)
    objectives: Mapped[list[str]] = mapped_column(JSON, default=list)
    planned_activities: Mapped[list[str]] = mapped_column(JSON, default=list)
    planned_tests: Mapped[list[str]] = mapped_column(JSON, default=list)
    planned_week: Mapped[int] = mapped_column(Integer)
    completion_percentage: Mapped[int] = mapped_column(Integer, default=0)
    remarks: Mapped[str | None] = mapped_column(Text)

