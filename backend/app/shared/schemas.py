from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class OrmModel(BaseModel):
    model_config = {"from_attributes": True}


class EntityRead(OrmModel):
    id: UUID
    created_at: datetime
    updated_at: datetime

