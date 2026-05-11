from app.logbooks.domain import LogbookEntry
from app.preparation_cards.domain import PreparationLesson, ProgramProgress


class AcademicValidationEngine:
    """Rule-based validation boundary that can later delegate to AI or ML providers."""

    def compare_plan_to_logbook(
        self, planned_lessons: list[PreparationLesson], logbook_entries: list[LogbookEntry]
    ) -> ProgramProgress:
        taught = {entry.lesson_taught.strip().lower() for entry in logbook_entries}
        planned = {lesson.title.strip().lower(): lesson.title for lesson in planned_lessons}
        missing = [title for key, title in planned.items() if key not in taught]
        completed = len(planned_lessons) - len(missing)
        completion = (completed / len(planned_lessons) * 100) if planned_lessons else 0
        return ProgramProgress(
            completion_percentage=round(completion, 2),
            delayed_lessons=missing[:],
            missing_lessons=missing,
        )

