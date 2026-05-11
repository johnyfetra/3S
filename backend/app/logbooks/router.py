from app.logbooks.models import LogbookRecord
from app.logbooks.schemas import LogbookCreate, LogbookRead, LogbookUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/logbooks",
    tags=["logbooks"],
    model=LogbookRecord,
    read_schema=LogbookRead,
    create_permission=Permission.WRITE_LOGBOOK,
    update_permission=Permission.WRITE_LOGBOOK,
    delete_permission=Permission.WRITE_LOGBOOK,
).build(LogbookCreate, LogbookUpdate)

