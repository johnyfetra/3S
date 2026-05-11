from enum import StrEnum
from uuid import UUID

from sqlalchemy import Enum, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, IdMixin, TimestampMixin


class MessageStatus(StrEnum):
    SENT = "sent"
    DELIVERED = "delivered"
    SEEN = "seen"


class Conversation(IdMixin, TimestampMixin, Base):
    __tablename__ = "conversations"

    title: Mapped[str | None] = mapped_column(String(160))
    participant_user_ids: Mapped[list[str]] = mapped_column(JSON, default=list)
    is_group: Mapped[bool] = mapped_column(default=False)


class Message(IdMixin, TimestampMixin, Base):
    __tablename__ = "messages"

    conversation_id: Mapped[UUID] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    sender_user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    body: Mapped[str | None] = mapped_column(Text)
    voice_url: Mapped[str | None] = mapped_column(String(500))
    attachment_urls: Mapped[list[str]] = mapped_column(JSON, default=list)
    reactions: Mapped[list[dict[str, str]]] = mapped_column(JSON, default=list)
    status: Mapped[MessageStatus] = mapped_column(Enum(MessageStatus), default=MessageStatus.SENT)

