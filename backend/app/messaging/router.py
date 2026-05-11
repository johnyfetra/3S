from app.messaging.models import Conversation, Message
from app.messaging.schemas import (
    ConversationCreate,
    ConversationRead,
    ConversationUpdate,
    MessageCreate,
    MessageRead,
    MessageUpdate,
)
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

conversations_router = CrudRouterFactory(
    prefix="/conversations",
    tags=["conversations"],
    model=Conversation,
    read_schema=ConversationRead,
    create_permission=Permission.SEND_MESSAGES,
    update_permission=Permission.SEND_MESSAGES,
    delete_permission=Permission.SEND_MESSAGES,
).build(ConversationCreate, ConversationUpdate)

messages_router = CrudRouterFactory(
    prefix="/messages",
    tags=["messages"],
    model=Message,
    read_schema=MessageRead,
    create_permission=Permission.SEND_MESSAGES,
    update_permission=Permission.SEND_MESSAGES,
    delete_permission=Permission.SEND_MESSAGES,
).build(MessageCreate, MessageUpdate)

