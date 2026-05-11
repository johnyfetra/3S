from app.notifications.models import Notification
from app.notifications.schemas import NotificationCreate, NotificationRead, NotificationUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/notifications",
    tags=["notifications"],
    model=Notification,
    read_schema=NotificationRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.SEND_MESSAGES,
    delete_permission=Permission.MANAGE_USERS,
).build(NotificationCreate, NotificationUpdate)

