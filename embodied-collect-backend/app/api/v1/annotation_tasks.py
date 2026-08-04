from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.crud_factory import build_crud_router
from app.core.database import get_db_session
from app.core.response import success_response
from app.models.base import AnnotationRecord
from app.services.annotation_service import annotation_service

router = build_crud_router("annotation-tasks", annotation_service)
extra_router = APIRouter(prefix="/annotation-tasks", tags=["annotation-tasks"])


@extra_router.post("/{task_id}/assign")
async def assign_annotator(task_id: str, annotator_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await annotation_service.update(db, task_id, {"annotator_id": annotator_id, "status": "in_progress"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{task_id}/submit")
async def submit_annotation(task_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await annotation_service.update(db, task_id, {"status": "pending_review"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{task_id}/review")
async def review_annotation(task_id: str, review_status: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        status = "completed" if review_status == "pass" else "in_progress"
        obj = await annotation_service.update(db, task_id, {"status": status})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{task_id}/records")
async def list_records(task_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        stmt = select(AnnotationRecord).where(AnnotationRecord.annotation_task_id == task_id, AnnotationRecord.is_deleted == 0)
        records = (await db.execute(stmt)).scalars().all()
        return success_response(records, total=len(records))
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{task_id}/records")
async def create_record(task_id: str, payload: dict, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        record = AnnotationRecord(annotation_task_id=task_id, **payload)
        db.add(record)
        await db.commit()
        await db.refresh(record)
        return success_response(record)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}
