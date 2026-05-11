from datetime import date
from pydantic import BaseModel


class LogbookEntry(BaseModel):
    entry_date: date
    subject: str
    lesson_taught: str
    homework: str | None = None
    attendance_count: int
    remarks: str | None = None

