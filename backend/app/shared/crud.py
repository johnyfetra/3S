from typing import Any, Generic, TypeVar
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DomainError
from app.db.session import get_db_session
from app.security.rbac import Permission, require_permission

ModelT = TypeVar("ModelT")
CreateSchemaT = TypeVar("CreateSchemaT", bound=BaseModel)
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=BaseModel)
ReadSchemaT = TypeVar("ReadSchemaT", bound=BaseModel)


class CrudRouterFactory(Generic[ModelT, CreateSchemaT, UpdateSchemaT, ReadSchemaT]):
    def __init__(
        self,
        *,
        prefix: str,
        tags: list[str],
        model: type[ModelT],
        read_schema: type[ReadSchemaT],
        create_permission: Permission,
        update_permission: Permission,
        delete_permission: Permission,
        list_permission: Permission | None = None,
    ) -> None:
        self.prefix = prefix
        self.tags = tags
        self.model = model
        self.read_schema = read_schema
        self.create_permission = create_permission
        self.update_permission = update_permission
        self.delete_permission = delete_permission
        self.list_permission = list_permission

    def build(self, create_schema: type[CreateSchemaT], update_schema: type[UpdateSchemaT]) -> APIRouter:
        router = APIRouter(prefix=self.prefix, tags=self.tags)
        model = self.model
        read_schema = self.read_schema

        @router.get("", response_model=list[read_schema])  # type: ignore[valid-type]
        async def list_items(
            _: object = Depends(require_permission(self.list_permission or self.create_permission)),
            session: AsyncSession = Depends(get_db_session),
        ) -> list[ModelT]:
            result = await session.execute(select(model).order_by(model.created_at.desc()))  # type: ignore[attr-defined]
            return list(result.scalars().all())

        @router.post("", response_model=read_schema, status_code=201)  # type: ignore[valid-type]
        async def create_item(
            payload: create_schema,  # type: ignore[valid-type]
            _: object = Depends(require_permission(self.create_permission)),
            session: AsyncSession = Depends(get_db_session),
        ) -> ModelT:
            item = model(**payload.model_dump())  # type: ignore[call-arg]
            session.add(item)
            await session.commit()
            await session.refresh(item)
            return item

        @router.get("/{item_id}", response_model=read_schema)  # type: ignore[valid-type]
        async def get_item(
            item_id: UUID,
            _: object = Depends(require_permission(self.list_permission or self.create_permission)),
            session: AsyncSession = Depends(get_db_session),
        ) -> ModelT:
            item = await session.get(model, item_id)
            if item is None:
                raise DomainError("Record not found", status_code=404)
            return item

        @router.patch("/{item_id}", response_model=read_schema)  # type: ignore[valid-type]
        async def update_item(
            item_id: UUID,
            payload: update_schema,  # type: ignore[valid-type]
            _: object = Depends(require_permission(self.update_permission)),
            session: AsyncSession = Depends(get_db_session),
        ) -> ModelT:
            item = await session.get(model, item_id)
            if item is None:
                raise DomainError("Record not found", status_code=404)
            changes: dict[str, Any] = payload.model_dump(exclude_unset=True)
            for field, value in changes.items():
                setattr(item, field, value)
            await session.commit()
            await session.refresh(item)
            return item

        @router.delete("/{item_id}", status_code=204)
        async def delete_item(
            item_id: UUID,
            _: object = Depends(require_permission(self.delete_permission)),
            session: AsyncSession = Depends(get_db_session),
        ) -> None:
            item = await session.get(model, item_id)
            if item is None:
                raise DomainError("Record not found", status_code=404)
            await session.delete(item)
            await session.commit()

        return router

