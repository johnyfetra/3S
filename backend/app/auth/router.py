from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.dependencies import CurrentUser, get_current_user
from app.auth.schemas import LoginRequest, TokenPair
from app.auth.service import AuthService
from app.core.exceptions import DomainError
from app.db.session import get_db_session
from app.users.repository import UserRepository
from app.users.schemas import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenPair)
async def login(
    payload: LoginRequest, request: Request, session: AsyncSession = Depends(get_db_session)
) -> TokenPair:
    return await AuthService(session, UserRepository(session)).login(payload, request)


@router.get("/me", response_model=UserRead)
async def me(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    current = await UserRepository(session).get_by_id(user.id)
    if current is None:
        raise DomainError("User not found", status_code=404)
    return current
