from decimal import Decimal, ROUND_HALF_UP

MENTION_SCALE = [
    (Decimal("18"), "A+"),
    (Decimal("16"), "A"),
    (Decimal("14"), "B+"),
    (Decimal("12"), "B"),
    (Decimal("10"), "C+"),
    (Decimal("8"), "C"),
    (Decimal("6"), "D"),
    (Decimal("0"), "F"),
]


def calculate_bimester_average(test_score: Decimal, exam_score: Decimal) -> Decimal:
    """Normalize one DS score /20 and one exam score /40 into an average /20."""
    return ((test_score + exam_score) / Decimal("3")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_weighted_score(average: Decimal, coefficient: Decimal) -> Decimal:
    return (average * coefficient).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def resolve_mention(average: Decimal) -> str:
    return next(label for threshold, label in MENTION_SCALE if average >= threshold)
