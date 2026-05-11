from uuid import UUID

from pydantic import Field

from app.messaging.models import MessageStatus
from app.shared.schemas import EntityRead, OrmModel


class ConversationBase(OrmModel):
    title: str | None = Field(default=None, max_length=160)
    participant_user_ids: list[str] = Field(default_factory=list)
    is_group: bool = False


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(OrmModel):
    title: str | None = Field(default=None, max_length=160)
    participant_user_ids: list[str] | None = None
    is_group: bool | None = None


class ConversationRead(ConversationBase, EntityRead):
    pass


class MessageBase(OrmModel):
    conversation_id: UUID
    sender_user_id: UUID
    body: str | None = None
    voice_url: str | None = Field(default=None, max_length=500)
    attachment_urls: list[str] = Field(default_factory=list)
    reactions: list[dict[str, str]] = Field(default_factory=list)
    status: MessageStatus = MessageStatus.SENT


class MessageCreate(MessageBase):
    pass


class MessageUpdate(OrmModel):
    body: str | None = None
    voice_url: str | None = Field(default=None, max_length=500)
    attachment_urls: list[str] | None = None
    reactions: list[dict[str, str]] | None = None
    status: MessageStatus | None = None


class MessageRead(MessageBase, EntityRead):
    pass

