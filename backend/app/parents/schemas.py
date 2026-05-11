from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class ParentBase(OrmModel):
    user_id: UUID | None = None
    full_name: str = Field(min_length=2, max_length=160)
    phone: str | None = Field(default=None, max_length=40)
    address: str | None = Field(default=None, max_length=240)


class ParentCreate(ParentBase):
    pass


class ParentUpdate(OrmModel):
    user_id: UUID | None = None
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    phone: str | None = Field(default=None, max_length=40)
    address: str | None = Field(default=None, max_length=240)


class ParentRead(ParentBase, EntityRead):
    pass

