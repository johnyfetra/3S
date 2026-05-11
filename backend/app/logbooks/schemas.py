from datetime import date
from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class LogbookBase(OrmModel):
    teacher_id: UUID
    entry_date: date
    subject: str = Field(min_length=1, max_length=140)
    class_name: str = Field(min_length=1, max_length=80)
    lesson_taught: str = Field(min_length=1, max_length=220)
    homework: str | None = None
    attendance_count: int = Field(ge=0)
    remarks: str | None = None


class LogbookCreate(LogbookBase):
    pass


class LogbookUpdate(OrmModel):
    entry_date: date | None = None
    subject: str | None = Field(default=None, min_length=1, max_length=140)
    class_name: str | None = Field(default=None, min_length=1, max_length=80)
    lesson_taught: str | None = Field(default=None, min_length=1, max_length=220)
    homework: str | None = None
    attendance_count: int | None = Field(default=None, ge=0)
    remarks: str | None = None


class LogbookRead(LogbookBase, EntityRead):
    pass

