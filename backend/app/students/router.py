from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory
from app.students.models import Student
from app.students.schemas import StudentCreate, StudentRead, StudentUpdate

router = CrudRouterFactory(
    prefix="/students",
    tags=["students"],
    model=Student,
    read_schema=StudentRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.MANAGE_USERS,
    delete_permission=Permission.MANAGE_USERS,
).build(StudentCreate, StudentUpdate)

