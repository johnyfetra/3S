from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class AdminBase(OrmModel):
    user_id: UUID | None = None
    full_name: str = Field(min_length=2, max_length=160)
    department: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)


class AdminCreate(AdminBase):
    pass


class AdminUpdate(OrmModel):
    user_id: UUID | None = None
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    department: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)


class AdminRead(AdminBase, EntityRead):
    pass

