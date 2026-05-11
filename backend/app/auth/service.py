from datetime import UTC, datetime, timedelta
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.schemas import LoginRequest, TokenPair
from app.auth.security import create_token, verify_password
from app.core.config import get_settings
from app.core.exceptions import DomainError
from app.users.models import AccountStatus, LoginHistory
from app.users.repository import UserRepository


class AuthService:
    def __init__(self, session: AsyncSession, users: UserRepository) -> None:
        self.session = session
        self.users = users

    async def login(self, payload: LoginRequest, request: Request) -> TokenPair:
        user = await self.users.get_by_username(payload.username)
        if not user or not verify_password(payload.password, user.password_hash):
            raise DomainError("Invalid username or password", status_code=401)
        if user.status == AccountStatus.BLOCKED:
            raise DomainError("Account is blocked", status_code=403)

        settings = get_settings()
        user.last_seen_at = datetime.now(UTC)
        self.session.add(
            LoginHistory(
                user_id=user.id,
                ip_address=request.client.host if request.client else None,
                device_fingerprint=request.headers.get("x-device-fingerprint"),
                geo_label=request.headers.get("x-geo-label"),
                user_agent=request.headers.get("user-agent"),
                logged_in_at=datetime.now(UTC),
            )
        )
        await self.session.commit()
        return TokenPair(
            access_token=create_token(
                user.id, user.role.value, timedelta(minutes=settings.access_token_minutes), "access"
            ),
            refresh_token=create_token(
                user.id, user.role.value, timedelta(days=settings.refresh_token_days), "refresh"
            ),
            force_password_reset=user.force_password_reset,
        )

