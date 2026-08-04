from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.crud_factory import build_crud_router
from app.core.database import get_db_session
from app.core.response import success_response
from app.models.base import QualityCheck
from app.services.base_service import CRUDService
from app.services.quality_service import quality_service

router = build_crud_router("quality-check", quality_service)
extra_router = APIRouter(prefix="/quality-check", tags=["quality-check"])
service = CRUDService(QualityCheck)


@extra_router.post("/trigger")
async def trigger_quality_check(payload: dict, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await service.create(db, payload)
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{check_id}/report")
async def quality_report(check_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await service.get(db, check_id)
        return success_response({"report": obj.result if obj else None})
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}
