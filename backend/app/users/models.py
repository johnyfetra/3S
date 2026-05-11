from enum import StrEnum
from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, IdMixin, TimestampMixin
from app.security.rbac import Role
from datetime import datetime
from uuid import UUID


class AccountStatus(StrEnum):
    ACTIVE = "active"
    BLOCKED = "blocked"


class User(IdMixin, TimestampMixin, Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(160))
    role: Mapped[Role] = mapped_column(Enum(Role), index=True)
    status: Mapped[AccountStatus] = mapped_column(Enum(AccountStatus), default=AccountStatus.ACTIVE)
    force_password_reset: Mapped[bool] = mapped_column(Boolean, default=True)
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    login_history: Mapped[list["LoginHistory"]] = relationship(back_populates="user")


class LoginHistory(IdMixin, TimestampMixin, Base):
    __tablename__ = "login_history"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    ip_address: Mapped[str | None] = mapped_column(String(64))
    device_fingerprint: Mapped[str | None] = mapped_column(String(180))
    geo_label: Mapped[str | None] = mapped_column(String(180))
    user_agent: Mapped[str | None] = mapped_column(Text)
    logged_in_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    user: Mapped[User] = relationship(back_populates="login_history")

