from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class Notification(IdMixin, TimestampMixin, Base):
    __tablename__ = "notifications"

    recipient_user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180), index=True)
    body: Mapped[str] = mapped_column(Text)
    channel: Mapped[str] = mapped_column(String(40), default="in_app")
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[dict[str, object]] = mapped_column(JSON, default=dict)

