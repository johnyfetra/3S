from decimal import Decimal
from enum import StrEnum
from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin
from app.students.models import SchoolSection


class AssignmentStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class GradeStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    LOCKED = "locked"


class SchoolClass(IdMixin, TimestampMixin, Base):
    __tablename__ = "school_classes"
    __table_args__ = (UniqueConstraint("academic_year", "section", "grade_level", "name", name="uq_school_class_year_name"),)

    academic_year: Mapped[str] = mapped_column(String(20), index=True)
    name: Mapped[str] = mapped_column(String(80), index=True)
    section: Mapped[SchoolSection] = mapped_column(Enum(SchoolSection), index=True)
    grade_level: Mapped[int] = mapped_column(Integer, index=True)
    responsible_teacher_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("teacher_profiles.id", ondelete="SET NULL"),
        index=True,
    )
    room_label: Mapped[str | None] = mapped_column(String(80))


class Subject(IdMixin, TimestampMixin, Base):
    __tablename__ = "subjects"
    __table_args__ = (UniqueConstraint("code", name="uq_subject_code"),)

    code: Mapped[str] = mapped_column(String(40), index=True)
    name: Mapped[str] = mapped_column(String(140), index=True)
    section: Mapped[SchoolSection | None] = mapped_column(Enum(SchoolSection), index=True)
    default_coefficient: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("1"))


class TeachingAssignment(IdMixin, TimestampMixin, Base):
    __tablename__ = "teaching_assignments"
    __table_args__ = (
        UniqueConstraint("academic_year", "teacher_id", "class_id", "subject_id", name="uq_teacher_class_subject_year"),
    )

    academic_year: Mapped[str] = mapped_column(String(20), index=True)
    teacher_id: Mapped[UUID] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"), index=True)
    class_id: Mapped[UUID] = mapped_column(ForeignKey("school_classes.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[UUID] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    coefficient: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("1"))
    status: Mapped[AssignmentStatus] = mapped_column(Enum(AssignmentStatus), default=AssignmentStatus.ACTIVE, index=True)


class GradeEntry(IdMixin, TimestampMixin, Base):
    __tablename__ = "grade_entries"
    __table_args__ = (
        UniqueConstraint("student_id", "assignment_id", "academic_year", "bimester", name="uq_student_assignment_bimester"),
    )

    student_id: Mapped[UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    assignment_id: Mapped[UUID] = mapped_column(ForeignKey("teaching_assignments.id", ondelete="CASCADE"), index=True)
    academic_year: Mapped[str] = mapped_column(String(20), index=True)
    bimester: Mapped[int] = mapped_column(Integer, index=True)
    test_score: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    exam_score: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    average: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    coefficient: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    weighted_score: Mapped[Decimal] = mapped_column(Numeric(7, 2))
    mention: Mapped[str] = mapped_column(String(3))
    teacher_remark: Mapped[str | None] = mapped_column(Text)
    status: Mapped[GradeStatus] = mapped_column(Enum(GradeStatus), default=GradeStatus.DRAFT, index=True)
