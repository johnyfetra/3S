from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class Announcement(IdMixin, TimestampMixin, Base):
    __tablename__ = "announcements"

    author_user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180), index=True)
    body: Mapped[str] = mapped_column(Text)
    pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    audience_roles: Mapped[list[str]] = mapped_column(JSON, default=list)
    attachment_urls: Mapped[list[str]] = mapped_column(JSON, default=list)
    read_by_user_ids: Mapped[list[str]] = mapped_column(JSON, default=list)

