from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.security import hash_password
from app.core.exceptions import DomainError
from app.db.session import get_db_session
from app.security.rbac import Permission, require_permission
from app.users.repository import UserRepository
from app.users.schemas import UserCreate, UserRead, UserUpdate
from app.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
async def list_users(
    _: object = Depends(require_permission(Permission.MANAGE_USERS)),
    session: AsyncSession = Depends(get_db_session),
) -> list[UserRead]:
    return await UserRepository(session).list()


@router.post("", response_model=UserRead, status_code=201)
async def create_user(
    payload: UserCreate,
    _: object = Depends(require_permission(Permission.MANAGE_USERS)),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    user = await UserService(UserRepository(session)).create_user(payload)
    await session.commit()
    return user


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: UUID,
    _: object = Depends(require_permission(Permission.MANAGE_USERS)),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    user = await UserRepository(session).get_by_id(user_id)
    if user is None:
        raise DomainError("User not found", status_code=404)
    return user


@router.patch("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: UUID,
    payload: UserUpdate,
    _: object = Depends(require_permission(Permission.MANAGE_USERS)),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    user = await UserRepository(session).get_by_id(user_id)
    if user is None:
        raise DomainError("User not found", status_code=404)
    changes = payload.model_dump(exclude_unset=True)
    password = changes.pop("password", None)
    if password:
        user.password_hash = hash_password(password)
    for field, value in changes.items():
        setattr(user, field, value)
    await session.commit()
    await session.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: UUID,
    _: object = Depends(require_permission(Permission.MANAGE_USERS)),
    session: AsyncSession = Depends(get_db_session),
) -> None:
    user = await UserRepository(session).get_by_id(user_id)
    if user is None:
        raise DomainError("User not found", status_code=404)
    await session.delete(user)
    await session.commit()
