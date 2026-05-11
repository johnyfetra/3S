from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class TeacherBase(OrmModel):
    user_id: UUID | None = None
    employee_code: str = Field(min_length=1, max_length=40)
    full_name: str = Field(min_length=2, max_length=160)
    subjects: list[str] = Field(default_factory=list)
    phone: str | None = Field(default=None, max_length=40)
    current_location: str | None = Field(default=None, max_length=180)
    status: str = Field(default="active", max_length=40)


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(OrmModel):
    user_id: UUID | None = None
    employee_code: str | None = Field(default=None, min_length=1, max_length=40)
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    subjects: list[str] | None = None
    phone: str | None = Field(default=None, max_length=40)
    current_location: str | None = Field(default=None, max_length=180)
    status: str | None = Field(default=None, max_length=40)


class TeacherRead(TeacherBase, EntityRead):
    pass

