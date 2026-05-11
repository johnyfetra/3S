from enum import StrEnum
from fastapi import Depends
from app.core.exceptions import DomainError
from app.auth.dependencies import CurrentUser, get_current_user


class Role(StrEnum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    TEACHER = "teacher"
    PARENT = "parent"


class Permission(StrEnum):
    MANAGE_USERS = "manage_users"
    VIEW_MONITORING = "view_monitoring"
    MANAGE_REPORT_CARDS = "manage_report_cards"
    MANAGE_TIMETABLE = "manage_timetable"
    WRITE_LOGBOOK = "write_logbook"
    VIEW_CHILDREN = "view_children"
    SEND_MESSAGES = "send_messages"


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.SUPER_ADMIN: set(Permission),
    Role.ADMIN: {
        Permission.MANAGE_USERS,
        Permission.VIEW_MONITORING,
        Permission.MANAGE_REPORT_CARDS,
        Permission.MANAGE_TIMETABLE,
        Permission.SEND_MESSAGES,
    },
    Role.TEACHER: {Permission.WRITE_LOGBOOK, Permission.SEND_MESSAGES},
    Role.PARENT: {Permission.VIEW_CHILDREN, Permission.SEND_MESSAGES},
}


def require_permission(permission: Permission):
    async def dependency(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        role = Role(user.role)
        if permission not in ROLE_PERMISSIONS[role]:
            raise DomainError("Insufficient permissions", status_code=403)
        return user

    return dependency

