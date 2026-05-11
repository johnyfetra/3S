from uuid import UUID

from pydantic import Field

from app.shared.schemas import EntityRead, OrmModel


class AuditLogBase(OrmModel):
    actor_user_id: UUID | None = None
    action: str = Field(min_length=1, max_length=120)
    entity_type: str = Field(min_length=1, max_length=120)
    entity_id: str | None = Field(default=None, max_length=80)
    ip_address: str | None = Field(default=None, max_length=64)
    metadata_json: dict[str, object] = Field(default_factory=dict)


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogUpdate(OrmModel):
    action: str | None = Field(default=None, min_length=1, max_length=120)
    entity_type: str | None = Field(default=None, min_length=1, max_length=120)
    entity_id: str | None = Field(default=None, max_length=80)
    ip_address: str | None = Field(default=None, max_length=64)
    metadata_json: dict[str, object] | None = None


class AuditLogRead(AuditLogBase, EntityRead):
    pass

