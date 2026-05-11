from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class ReportCardBase(OrmModel):
    student_id: UUID
    academic_year: str = Field(min_length=4, max_length=20)
    bimester: int = Field(ge=1, le=5)
    grade_level: int = Field(ge=1, le=12)
    general_average: Decimal | None = None
    total_coefficients: Decimal | None = None
    weighted_total: Decimal | None = None
    rank: int | None = Field(default=None, ge=1)
    class_average: Decimal | None = None
    council_decision: str | None = Field(default=None, max_length=180)
    principal_comment: str | None = None


class ReportCardCreate(ReportCardBase):
    pass


class ReportCardUpdate(OrmModel):
    general_average: Decimal | None = None
    total_coefficients: Decimal | None = None
    weighted_total: Decimal | None = None
    rank: int | None = Field(default=None, ge=1)
    class_average: Decimal | None = None
    council_decision: str | None = Field(default=None, max_length=180)
    principal_comment: str | None = None


class ReportCardRead(ReportCardBase, EntityRead):
    pass


class ReportCardLineBase(OrmModel):
    report_card_id: UUID
    subject: str = Field(min_length=1, max_length=140)
    test_score: Decimal = Field(ge=0)
    exam_score: Decimal = Field(ge=0)
    average: Decimal = Field(ge=0)
    coefficient: Decimal = Field(gt=0)
    weighted_score: Decimal = Field(ge=0)
    teacher_remark: str | None = None
    mention: str = Field(min_length=1, max_length=3)
    metadata_json: dict[str, object] = Field(default_factory=dict)


class ReportCardLineCreate(ReportCardLineBase):
    pass


class ReportCardLineUpdate(OrmModel):
    subject: str | None = Field(default=None, min_length=1, max_length=140)
    test_score: Decimal | None = Field(default=None, ge=0)
    exam_score: Decimal | None = Field(default=None, ge=0)
    average: Decimal | None = Field(default=None, ge=0)
    coefficient: Decimal | None = Field(default=None, gt=0)
    weighted_score: Decimal | None = Field(default=None, ge=0)
    teacher_remark: str | None = None
    mention: str | None = Field(default=None, min_length=1, max_length=3)
    metadata_json: dict[str, object] | None = None


class ReportCardLineRead(ReportCardLineBase, EntityRead):
    pass

