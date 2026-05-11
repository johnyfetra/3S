from datetime import datetime
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(min_length=3, max_length=80)
    password: str = Field(min_length=8, max_length=128)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    force_password_reset: bool


class LoginHistoryRead(BaseModel):
    logged_in_at: datetime
    ip_address: str | None
    device_fingerprint: str | None
    geo_label: str | None

