from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import success_response
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview")
async def overview(db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        return success_response(await dashboard_service.overview(db))
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/trend")
async def trend(db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        data = await dashboard_service.trend(db)
        return success_response(data, total=len(data))
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/device-status")
async def device_status(db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        data = await dashboard_service.device_list(db)
        return success_response(data)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/recent-logs")
async def recent_logs(db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        logs = await dashboard_service.recent_logs(db)
        return success_response(logs, total=len(logs))
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}
