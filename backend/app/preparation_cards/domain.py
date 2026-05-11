from pydantic import BaseModel, Field

BIMESTER_COUNT = 5


class PreparationLesson(BaseModel):
    title: str
    objectives: list[str] = Field(default_factory=list)
    planned_activities: list[str] = Field(default_factory=list)
    planned_tests: list[str] = Field(default_factory=list)
    bimester: int = Field(ge=1, le=BIMESTER_COUNT)
    planned_week: int = Field(ge=1, le=52)


class ProgramProgress(BaseModel):
    completion_percentage: float
    delayed_lessons: list[str]
    missing_lessons: list[str]

