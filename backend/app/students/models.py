from enum import StrEnum
from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class SchoolSection(StrEnum):
    PRIMARY = "primary"
    MIDDLE_SCHOOL = "middle_school"
    HIGH_SCHOOL = "high_school"


class Student(IdMixin, TimestampMixin, Base):
    __tablename__ = "students"

    code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(160), index=True)
    section: Mapped[SchoolSection] = mapped_column(Enum(SchoolSection), index=True)
    grade_level: Mapped[int] = mapped_column(Integer, index=True)
    class_name: Mapped[str] = mapped_column(String(80), index=True)
    guardian_name: Mapped[str | None] = mapped_column(String(160))
    parent_user_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    image_url: Mapped[str | None] = mapped_column(String(500))

