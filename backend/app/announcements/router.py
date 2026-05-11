from app.announcements.models import Announcement
from app.announcements.schemas import AnnouncementCreate, AnnouncementRead, AnnouncementUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/announcements",
    tags=["announcements"],
    model=Announcement,
    read_schema=AnnouncementRead,
    create_permission=Permission.MANAGE_USERS,
    update_permission=Permission.MANAGE_USERS,
    delete_permission=Permission.MANAGE_USERS,
).build(AnnouncementCreate, AnnouncementUpdate)

