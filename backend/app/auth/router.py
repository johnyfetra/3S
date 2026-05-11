from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.schemas import LoginRequest, TokenPair
from app.auth.service import AuthService
from app.db.session import get_db_session
from app.users.repository import UserRepository

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenPair)
async def login(
    payload: LoginRequest, request: Request, session: AsyncSession = Depends(get_db_session)
) -> TokenPair:
    return await AuthService(session, UserRepository(session)).login(payload, request)

