from app.auth.security import hash_password
from app.core.exceptions import DomainError
from app.users.models import User
from app.users.repository import UserRepository
from app.users.schemas import UserCreate


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def create_user(self, payload: UserCreate) -> User:
        existing = await self.repository.get_by_username(payload.username)
        if existing:
            raise DomainError("Username already exists", status_code=409)
        return await self.repository.add(
            User(
                username=payload.username,
                password_hash=hash_password(payload.password),
                full_name=payload.full_name,
                role=payload.role,
                force_password_reset=True,
            )
        )

