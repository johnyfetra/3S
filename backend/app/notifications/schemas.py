from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class NotificationBase(OrmModel):
    recipient_user_id: UUID
    title: str = Field(min_length=1, max_length=180)
    body: str = Field(min_length=1)
    channel: str = Field(default="in_app", max_length=40)
    read: bool = False
    metadata_json: dict[str, object] = Field(default_factory=dict)


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(OrmModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    body: str | None = Field(default=None, min_length=1)
    channel: str | None = Field(default=None, max_length=40)
    read: bool | None = None
    metadata_json: dict[str, object] | None = None


class NotificationRead(NotificationBase, EntityRead):
    pass

