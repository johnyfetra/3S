from decimal import Decimal
from uuid import UUID

from sqlalchemy import ForeignKey, Integer, JSON, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class ReportCard(IdMixin, TimestampMixin, Base):
    __tablename__ = "report_cards"
    __table_args__ = (
        UniqueConstraint("student_id", "academic_year", "bimester", name="uq_student_report_bimester"),
    )

    student_id: Mapped[UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    academic_year: Mapped[str] = mapped_column(String(20), index=True)
    bimester: Mapped[int] = mapped_column(Integer, index=True)
    grade_level: Mapped[int] = mapped_column(Integer, index=True)
    general_average: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    total_coefficients: Mapped[Decimal | None] = mapped_column(Numeric(6, 2))
    weighted_total: Mapped[Decimal | None] = mapped_column(Numeric(7, 2))
    rank: Mapped[int | None] = mapped_column(Integer)
    class_average: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    council_decision: Mapped[str | None] = mapped_column(String(180))
    principal_comment: Mapped[str | None] = mapped_column(Text)


class ReportCardLine(IdMixin, TimestampMixin, Base):
    __tablename__ = "report_card_lines"

    report_card_id: Mapped[UUID] = mapped_column(ForeignKey("report_cards.id", ondelete="CASCADE"), index=True)
    subject: Mapped[str] = mapped_column(String(140), index=True)
    test_score: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    exam_score: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    average: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    coefficient: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    weighted_score: Mapped[Decimal] = mapped_column(Numeric(7, 2))
    teacher_remark: Mapped[str | None] = mapped_column(Text)
    mention: Mapped[str] = mapped_column(String(3))
    metadata_json: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)

