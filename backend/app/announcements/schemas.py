from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class AnnouncementBase(OrmModel):
    author_user_id: UUID
    title: str = Field(min_length=1, max_length=180)
    body: str = Field(min_length=1)
    pinned: bool = False
    audience_roles: list[str] = Field(default_factory=list)
    attachment_urls: list[str] = Field(default_factory=list)
    read_by_user_ids: list[str] = Field(default_factory=list)


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(OrmModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    body: str | None = Field(default=None, min_length=1)
    pinned: bool | None = None
    audience_roles: list[str] | None = None
    attachment_urls: list[str] | None = None
    read_by_user_ids: list[str] | None = None


class AnnouncementRead(AnnouncementBase, EntityRead):
    pass

