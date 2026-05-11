from datetime import time
from uuid import UUID

from pydantic import Field, model_validator

from app.shared.schemas import EntityRead, OrmModel


class ClassroomBase(OrmModel):
    name: str = Field(min_length=1, max_length=80)
    capacity: int = Field(default=30, ge=1, le=500)
    building: str | None = Field(default=None, max_length=120)


class ClassroomCreate(ClassroomBase):
    pass


class ClassroomUpdate(OrmModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    capacity: int | None = Field(default=None, ge=1, le=500)
    building: str | None = Field(default=None, max_length=120)


class ClassroomRead(ClassroomBase, EntityRead):
    pass


class ScheduleBase(OrmModel):
    teacher_id: UUID
    classroom_id: UUID
    subject: str = Field(min_length=1, max_length=120)
    class_name: str = Field(min_length=1, max_length=80)
    weekday: int = Field(ge=1, le=7)
    starts_at: time
    ends_at: time

    @model_validator(mode="after")
    def validate_time_range(self) -> "ScheduleBase":
        if self.starts_at >= self.ends_at:
            raise ValueError("starts_at must be before ends_at")
        return self


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(OrmModel):
    teacher_id: UUID | None = None
    classroom_id: UUID | None = None
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    class_name: str | None = Field(default=None, min_length=1, max_length=80)
    weekday: int | None = Field(default=None, ge=1, le=7)
    starts_at: time | None = None
    ends_at: time | None = None


class ScheduleRead(ScheduleBase, EntityRead):
    pass

