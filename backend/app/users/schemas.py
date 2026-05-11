from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from app.security.rbac import Role
from app.users.models import AccountStatus


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=80)
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=160)
    role: Role


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=80)
    password: str | None = Field(default=None, min_length=8, max_length=128)
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    role: Role | None = None
    status: AccountStatus | None = None
    force_password_reset: bool | None = None


class UserRead(BaseModel):
    id: UUID
    username: str
    full_name: str
    role: Role
    status: AccountStatus
    force_password_reset: bool
    last_seen_at: datetime | None

    model_config = {"from_attributes": True}
