from dataclasses import dataclass
from datetime import time
from uuid import UUID


@dataclass(frozen=True)
class ScheduleSlot:
    teacher_id: UUID
    classroom_id: UUID
    class_id: UUID
    weekday: int
    starts_at: time
    ends_at: time


def overlaps(left: ScheduleSlot, right: ScheduleSlot) -> bool:
    return left.weekday == right.weekday and left.starts_at < right.ends_at and right.starts_at < left.ends_at


def detect_conflicts(existing: list[ScheduleSlot], candidate: ScheduleSlot) -> list[str]:
    conflicts: list[str] = []
    for slot in existing:
        if not overlaps(slot, candidate):
            continue
        if slot.teacher_id == candidate.teacher_id:
            conflicts.append("teacher_conflict")
        if slot.classroom_id == candidate.classroom_id:
            conflicts.append("classroom_conflict")
        if slot.class_id == candidate.class_id:
            conflicts.append("duplicate_class_schedule")
    return sorted(set(conflicts))

