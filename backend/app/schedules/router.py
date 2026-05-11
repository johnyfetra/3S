from app.schedules.models import Classroom, ScheduleEntry
from app.schedules.schemas import (
    ClassroomCreate,
    ClassroomRead,
    ClassroomUpdate,
    ScheduleCreate,
    ScheduleRead,
    ScheduleUpdate,
)
from app.security.rbac import Permission
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

schedule_router = CrudRouterFactory(
    prefix="/schedules",
    tags=["schedules"],
    model=ScheduleEntry,
    read_schema=ScheduleRead,
    create_permission=Permission.MANAGE_TIMETABLE,
    update_permission=Permission.MANAGE_TIMETABLE,
    delete_permission=Permission.MANAGE_TIMETABLE,
).build(ScheduleCreate, ScheduleUpdate)

