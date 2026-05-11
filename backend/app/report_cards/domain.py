from decimal import Decimal, ROUND_HALF_UP
from pydantic import BaseModel

MENTION_SCALE = [
    (Decimal("90"), "A+"),
    (Decimal("80"), "A"),
    (Decimal("75"), "B+"),
    (Decimal("70"), "B"),
    (Decimal("60"), "C+"),
    (Decimal("50"), "C"),
    (Decimal("40"), "D"),
    (Decimal("0"), "F"),
]


class SubjectGrade(BaseModel):
    subject: str
    test_score: Decimal
    exam_score: Decimal
    coefficient: Decimal
    teacher_remark: str | None = None


class CalculatedSubjectGrade(SubjectGrade):
    average: Decimal
    weighted_score: Decimal
    mention: str


def calculate_subject_grade(grade: SubjectGrade) -> CalculatedSubjectGrade:
    average = ((grade.test_score * Decimal("0.4")) + (grade.exam_score * Decimal("0.6"))).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    weighted = (average * grade.coefficient).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    mention = next(label for threshold, label in MENTION_SCALE if average >= threshold)
    return CalculatedSubjectGrade(**grade.model_dump(), average=average, weighted_score=weighted, mention=mention)


def calculate_general_average(grades: list[CalculatedSubjectGrade]) -> Decimal:
    total_coefficients = sum((grade.coefficient for grade in grades), Decimal("0"))
    if total_coefficients == 0:
        return Decimal("0")
    weighted_total = sum((grade.weighted_score for grade in grades), Decimal("0"))
    return (weighted_total / total_coefficients).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

