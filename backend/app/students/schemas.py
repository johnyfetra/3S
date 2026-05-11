from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel
from app.students.models import SchoolSection


class StudentBase(OrmModel):
    code: str = Field(min_length=1, max_length=40)
    full_name: str = Field(min_length=2, max_length=160)
    section: SchoolSection
    grade_level: int = Field(ge=1, le=12)
    class_name: str = Field(min_length=1, max_length=80)
    guardian_name: str | None = Field(default=None, max_length=160)
    parent_user_id: UUID | None = None
    image_url: str | None = Field(default=None, max_length=500)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(OrmModel):
    code: str | None = Field(default=None, min_length=1, max_length=40)
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    section: SchoolSection | None = None
    grade_level: int | None = Field(default=None, ge=1, le=12)
    class_name: str | None = Field(default=None, min_length=1, max_length=80)
    guardian_name: str | None = Field(default=None, max_length=160)
    parent_user_id: UUID | None = None
    image_url: str | None = Field(default=None, max_length=500)


class StudentRead(StudentBase, EntityRead):
    pass

