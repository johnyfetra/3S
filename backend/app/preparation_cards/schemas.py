from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class PreparationCardBase(OrmModel):
    teacher_id: UUID
    academic_year: str = Field(min_length=4, max_length=20)
    subject: str = Field(min_length=1, max_length=140)
    class_name: str = Field(min_length=1, max_length=80)
    bimester: int = Field(ge=1, le=5)
    lesson_title: str = Field(min_length=1, max_length=220)
    objectives: list[str] = Field(default_factory=list)
    planned_activities: list[str] = Field(default_factory=list)
    planned_tests: list[str] = Field(default_factory=list)
    planned_week: int = Field(ge=1, le=52)
    completion_percentage: int = Field(default=0, ge=0, le=100)
    remarks: str | None = None


class PreparationCardCreate(PreparationCardBase):
    pass


class PreparationCardUpdate(OrmModel):
    subject: str | None = Field(default=None, min_length=1, max_length=140)
    class_name: str | None = Field(default=None, min_length=1, max_length=80)
    bimester: int | None = Field(default=None, ge=1, le=5)
    lesson_title: str | None = Field(default=None, min_length=1, max_length=220)
    objectives: list[str] | None = None
    planned_activities: list[str] | None = None
    planned_tests: list[str] | None = None
    planned_week: int | None = Field(default=None, ge=1, le=52)
    completion_percentage: int | None = Field(default=None, ge=0, le=100)
    remarks: str | None = None


class PreparationCardRead(PreparationCardBase, EntityRead):
    pass

