from asyncio import sleep

from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import success_response
from app.models.base import ExportJob, ImportJob
from app.services.export_service import export_service, import_service

router = APIRouter(tags=["import-export"])


@router.post("/import/upload")
async def import_upload(project_id: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        content = await file.read()
        obj = await import_service.create(
            db,
            {
                "name": file.filename,
                "import_format": "auto",
                "file_path": f"/tmp/{file.filename}",
                "file_size_mb": len(content) / 1024 / 1024,
                "project_id": project_id,
            },
        )
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/import/{job_id}/progress")
async def import_progress(job_id: str, db: AsyncSession = Depends(get_db_session)) -> StreamingResponse:
    async def event_generator():
        for _ in range(5):
            job = await import_service.get(db, job_id)
            progress = getattr(job, "progress", 0)
            yield f"data: {{\"job_id\":\"{job_id}\",\"progress\":{progress}}}\n\n"
            await sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/export")
async def create_export(payload: dict, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await export_service.create(db, payload)
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/export/{job_id}/progress")
async def export_progress(job_id: str, db: AsyncSession = Depends(get_db_session)) -> StreamingResponse:
    async def event_generator():
        for _ in range(5):
            job = await export_service.get(db, job_id)
            progress = getattr(job, "progress", 0)
            yield f"data: {{\"job_id\":\"{job_id}\",\"progress\":{progress}}}\n\n"
            await sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/export/{job_id}/download")
async def export_download(job_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        job = await export_service.get(db, job_id)
        return success_response({"download_url": getattr(job, "download_url", None)})
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}
