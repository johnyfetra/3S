from decimal import Decimal
from uuid import UUID

from pydantic import Field

from app.academics.models import AssignmentStatus, GradeStatus
from app.shared.schemas import EntityRead, OrmModel
from app.students.models import SchoolSection
from app.students.schemas import StudentRead


class SchoolClassBase(OrmModel):
    academic_year: str = Field(min_length=4, max_length=20)
    name: str = Field(min_length=1, max_length=80)
    section: SchoolSection
    grade_level: int = Field(ge=1, le=12)
    responsible_teacher_id: UUID | None = None
    room_label: str | None = Field(default=None, max_length=80)


class SchoolClassCreate(SchoolClassBase):
    pass


class SchoolClassUpdate(OrmModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    section: SchoolSection | None = None
    grade_level: int | None = Field(default=None, ge=1, le=12)
    responsible_teacher_id: UUID | None = None
    room_label: str | None = Field(default=None, max_length=80)


class SchoolClassRead(SchoolClassBase, EntityRead):
    pass


class SubjectBase(OrmModel):
    code: str = Field(min_length=1, max_length=40)
    name: str = Field(min_length=1, max_length=140)
    section: SchoolSection | None = None
    default_coefficient: Decimal = Field(gt=0, le=20)


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(OrmModel):
    code: str | None = Field(default=None, min_length=1, max_length=40)
    name: str | None = Field(default=None, min_length=1, max_length=140)
    section: SchoolSection | None = None
    default_coefficient: Decimal | None = Field(default=None, gt=0, le=20)


class SubjectRead(SubjectBase, EntityRead):
    pass


class TeachingAssignmentBase(OrmModel):
    academic_year: str = Field(min_length=4, max_length=20)
    teacher_id: UUID
    class_id: UUID
    subject_id: UUID
    coefficient: Decimal = Field(gt=0, le=20)
    status: AssignmentStatus = AssignmentStatus.ACTIVE


class TeachingAssignmentCreate(TeachingAssignmentBase):
    pass


class TeachingAssignmentUpdate(OrmModel):
    teacher_id: UUID | None = None
    class_id: UUID | None = None
    subject_id: UUID | None = None
    coefficient: Decimal | None = Field(default=None, gt=0, le=20)
    status: AssignmentStatus | None = None


class TeachingAssignmentRead(TeachingAssignmentBase, EntityRead):
    pass


class GradeEntryCreate(OrmModel):
    student_id: UUID
    assignment_id: UUID
    academic_year: str = Field(min_length=4, max_length=20)
    bimester: int = Field(ge=1, le=5)
    test_score: Decimal = Field(ge=0, le=20)
    exam_score: Decimal = Field(ge=0, le=40)
    teacher_remark: str | None = None
    status: GradeStatus = GradeStatus.DRAFT


class GradeEntryUpdate(OrmModel):
    test_score: Decimal | None = Field(default=None, ge=0, le=20)
    exam_score: Decimal | None = Field(default=None, ge=0, le=40)
    teacher_remark: str | None = None
    status: GradeStatus | None = None


class GradeEntryRead(GradeEntryCreate, EntityRead):
    average: Decimal
    coefficient: Decimal
    weighted_score: Decimal
    mention: str


class TeacherAssignmentSummary(OrmModel):
    assignment_id: UUID
    academic_year: str
    class_id: UUID
    class_name: str
    grade_level: int
    section: SchoolSection
    subject_id: UUID
    subject_name: str
    coefficient: Decimal
    is_class_responsible: bool
    students: list[StudentRead]
