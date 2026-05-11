from app.admins.models import AdminProfile
from app.admins.schemas import AdminCreate, AdminRead, AdminUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/admins",
    tags=["admins"],
    model=AdminProfile,
    read_schema=AdminRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.MANAGE_USERS,
    delete_permission=Permission.MANAGE_USERS,
).build(AdminCreate, AdminUpdate)

