from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DomainError
from app.db.session import get_db_session
from app.schedules.models import Classroom, ScheduleEntry
from app.schedules.schemas import (
    ClassroomCreate,
    ClassroomRead,
    ClassroomUpdate,
    ScheduleCreate,
    ScheduleRead,
    ScheduleUpdate,
)
from app.security.rbac import Permission, require_permission
from app.shared.crud import CrudRouterFactory

classrooms_router = CrudRouterFactory(
    prefix="/classrooms",
    tags=["classrooms"],
    model=Classroom,
    read_schema=ClassroomRead,
    create_permission=Permission.MANAGE_TIMETABLE,
    update_permission=Permission.MANAGE_TIMETABLE,
    delete_permission=Permission.MANAGE_TIMETABLE,
).build(ClassroomCreate, ClassroomUpdate)

schedule_router = APIRouter(prefix="/schedules", tags=["schedules"])


async def _ensure_no_schedule_conflict(
    session: AsyncSession,
    payload: ScheduleCreate | ScheduleUpdate,
    existing_id: UUID | None = None,
    current: ScheduleEntry | None = None,
) -> None:
    teacher_id = payload.teacher_id if payload.teacher_id is not None else current.teacher_id if current else None
    classroom_id = payload.classroom_id if payload.classroom_id is not None else current.classroom_id if current else None
    class_name = payload.class_name if payload.class_name is not None else current.class_name if current else None
    weekday = payload.weekday if payload.weekday is not None else current.weekday if current else None
    starts_at = payload.starts_at if payload.starts_at is not None else current.starts_at if current else None
    ends_at = payload.ends_at if payload.ends_at is not None else current.ends_at if current else None

    if starts_at >= ends_at:
        raise DomainError("starts_at must be before ends_at", status_code=422)

    result = await session.execute(
        select(ScheduleEntry).where(
            ScheduleEntry.weekday == weekday,
            ScheduleEntry.starts_at < ends_at,
            starts_at < ScheduleEntry.ends_at,
        )
    )
    conflicts: list[str] = []
    for slot in result.scalars().all():
        if existing_id and slot.id == existing_id:
            continue
        if slot.teacher_id == teacher_id:
            conflicts.append("teacher_conflict")
        if slot.classroom_id == classroom_id:
            conflicts.append("classroom_conflict")
        if slot.class_name == class_name:
            conflicts.append("class_conflict")
    if conflicts:
        raise DomainError(f"Schedule conflict detected: {', '.join(sorted(set(conflicts)))}", status_code=409)


@schedule_router.get("", response_model=list[ScheduleRead])
async def list_schedules(
    _: object = Depends(require_permission(Permission.MANAGE_TIMETABLE)),
    session: AsyncSession = Depends(get_db_session),
) -> list[ScheduleEntry]:
    result = await session.execute(
        select(ScheduleEntry).order_by(ScheduleEntry.weekday.asc(), ScheduleEntry.starts_at.asc())
    )
    return list(result.scalars().all())


@schedule_router.post("", response_model=ScheduleRead, status_code=201)
async def create_schedule(
    payload: ScheduleCreate,
    _: object = Depends(require_permission(Permission.MANAGE_TIMETABLE)),
    session: AsyncSession = Depends(get_db_session),
) -> ScheduleEntry:
    await _ensure_no_schedule_conflict(session, payload)
    schedule = ScheduleEntry(**payload.model_dump())
    session.add(schedule)
    await session.commit()
    await session.refresh(schedule)
    return schedule


@schedule_router.patch("/{schedule_id}", response_model=ScheduleRead)
async def update_schedule(
    schedule_id: UUID,
    payload: ScheduleUpdate,
    _: object = Depends(require_permission(Permission.MANAGE_TIMETABLE)),
    session: AsyncSession = Depends(get_db_session),
) -> ScheduleEntry:
    schedule = await session.get(ScheduleEntry, schedule_id)
    if schedule is None:
        raise DomainError("Schedule entry not found", status_code=404)
    await _ensure_no_schedule_conflict(session, payload, existing_id=schedule_id, current=schedule)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(schedule, field, value)
    await session.commit()
    await session.refresh(schedule)
    return schedule


@schedule_router.delete("/{schedule_id}", status_code=204)
async def delete_schedule(
    schedule_id: UUID,
    _: object = Depends(require_permission(Permission.MANAGE_TIMETABLE)),
    session: AsyncSession = Depends(get_db_session),
) -> None:
    schedule = await session.get(ScheduleEntry, schedule_id)
    if schedule is None:
        raise DomainError("Schedule entry not found", status_code=404)
    await session.delete(schedule)
    await session.commit()
