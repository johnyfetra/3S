from dataclasses import dataclass
from uuid import UUID
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import get_settings
from app.core.exceptions import DomainError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@dataclass(frozen=True)
class CurrentUser:
    id: UUID
    role: str


async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            raise DomainError("Invalid token type", status_code=401)
        return CurrentUser(id=UUID(payload["sub"]), role=payload["role"])
    except (JWTError, KeyError, ValueError) as exc:
        raise DomainError("Invalid authentication credentials", status_code=401) from exc

