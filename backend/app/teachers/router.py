from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory
from app.teachers.models import TeacherProfile
from app.teachers.schemas import TeacherCreate, TeacherRead, TeacherUpdate

router = CrudRouterFactory(
    prefix="/teachers",
    tags=["teachers"],
    model=TeacherProfile,
    read_schema=TeacherRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.MANAGE_USERS,
    delete_permission=Permission.MANAGE_USERS,
).build(TeacherCreate, TeacherUpdate)

