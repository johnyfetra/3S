from app.parents.models import ParentProfile
from app.parents.schemas import ParentCreate, ParentRead, ParentUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/parents",
    tags=["parents"],
    model=ParentProfile,
    read_schema=ParentRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.MANAGE_USERS,
    delete_permission=Permission.MANAGE_USERS,
).build(ParentCreate, ParentUpdate)

