from asyncio import sleep

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.crud_factory import build_crud_router
from app.core.database import get_db_session
from app.core.response import success_response
from app.services.collection_service import collection_service

router = build_crud_router("collection-tasks", collection_service)
extra_router = APIRouter(prefix="/collection-tasks", tags=["collection-tasks"])


@extra_router.post("/{task_id}/start")
async def start_task(task_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await collection_service.update(db, task_id, {"status": "running"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{task_id}/stop")
async def stop_task(task_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await collection_service.update(db, task_id, {"status": "completed"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{task_id}/pause")
async def pause_task(task_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await collection_service.update(db, task_id, {"status": "paused"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{task_id}/status")
async def task_status_sse(task_id: str, db: AsyncSession = Depends(get_db_session)) -> StreamingResponse:
    async def event_generator():
        for _ in range(5):
            task = await collection_service.get(db, task_id)
            status = getattr(task, "status", "unknown")
            yield f"data: {{\"task_id\":\"{task_id}\",\"status\":\"{status}\"}}\n\n"
            await sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
