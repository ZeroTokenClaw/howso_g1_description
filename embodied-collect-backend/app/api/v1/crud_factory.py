from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.deps import get_current_user
from app.core.response import success_response
from app.models.base import User
from app.schemas.common import BatchDeletePayload, GenericIn, GenericUpdate, PageParams
from app.services.base_service import CRUDService, write_monitor_log


def build_crud_router(resource_name: str, service: CRUDService) -> APIRouter:
    router = APIRouter(prefix=f"/{resource_name}", tags=[resource_name])

    @router.get("")
    async def list_items(
        params: PageParams = Depends(),
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            rows, total = await service.list(
                db,
                page=params.page,
                page_size=params.page_size,
                keyword=params.keyword,
                status=params.status,
                project_id=params.project_id,
                sort_by=params.sort_by,
                sort_order=params.sort_order,
            )
            await write_monitor_log(db, module=resource_name, action="list", operator_id=current_user.id)
            return success_response(rows, total=total)
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    @router.get("/{item_id}")
    async def get_item(
        item_id: str,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            data = await service.get(db, item_id)
            await write_monitor_log(db, module=resource_name, action=f"detail:{item_id}", operator_id=current_user.id)
            return success_response(data)
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    @router.post("")
    async def create_item(
        payload: GenericIn,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            data = await service.create(db, payload.payload)
            await write_monitor_log(db, module=resource_name, action="create", operator_id=current_user.id, detail=payload.payload)
            return success_response(data)
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    @router.put("/{item_id}")
    async def update_item(
        item_id: str,
        payload: GenericUpdate,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            data = await service.update(db, item_id, payload.payload)
            await write_monitor_log(
                db,
                module=resource_name,
                action=f"update:{item_id}",
                operator_id=current_user.id,
                detail=payload.payload,
            )
            return success_response(data)
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    @router.delete("/{item_id}")
    async def delete_item(
        item_id: str,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            ok = await service.soft_delete(db, item_id)
            await write_monitor_log(db, module=resource_name, action=f"delete:{item_id}", operator_id=current_user.id)
            return success_response({"deleted": ok})
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    @router.delete("/batch")
    async def batch_delete(
        payload: BatchDeletePayload,
        db: AsyncSession = Depends(get_db_session),
        current_user: User = Depends(get_current_user),
    ) -> dict[str, Any]:
        try:
            deleted = await service.batch_soft_delete(db, payload.ids)
            await write_monitor_log(db, module=resource_name, action="batch_delete", operator_id=current_user.id, detail={"ids": payload.ids})
            return success_response({"deleted": deleted})
        except Exception as exc:
            return {"code": 500, "message": str(exc), "data": None}

    return router
