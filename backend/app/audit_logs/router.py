from app.audit_logs.models import AuditLog
from app.audit_logs.schemas import AuditLogCreate, AuditLogRead, AuditLogUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/audit-logs",
    tags=["audit-logs"],
    model=AuditLog,
    read_schema=AuditLogRead,
    create_permission=Permission.VIEW_MONITORING,
    update_permission=Permission.VIEW_MONITORING,
    delete_permission=Permission.VIEW_MONITORING,
).build(AuditLogCreate, AuditLogUpdate)

