from datetime import timedelta

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from minio import Minio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.crud_factory import build_crud_router
from app.core.config import settings
from app.core.database import get_db_session
from app.core.response import success_response
from app.models.base import DataFile
from app.services.dataset_service import dataset_service


def _minio_client() -> Minio:
    return Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=settings.minio_secure,
    )

router = build_crud_router("datasets", dataset_service)
extra_router = APIRouter(prefix="/datasets", tags=["datasets"])


@extra_router.post("/{dataset_id}/process")
async def process_dataset(dataset_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await dataset_service.update(db, dataset_id, {"status": "processing"})
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{dataset_id}/files")
async def get_dataset_files(dataset_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        stmt = select(DataFile).where(DataFile.dataset_id == dataset_id, DataFile.is_deleted == 0)
        files = (await db.execute(stmt)).scalars().all()
        return success_response(files, total=len(files))
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.post("/{dataset_id}/files/upload")
async def upload_dataset_file(dataset_id: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        content = await file.read()
        obj = DataFile(
            filename=file.filename,
            file_path=f"/tmp/{file.filename}",
            file_type=file.content_type or "application/octet-stream",
            file_size_mb=len(content) / 1024 / 1024,
            dataset_id=dataset_id,
        )
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return success_response(obj)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{dataset_id}/preview")
async def preview_dataset(dataset_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        obj = await dataset_service.get(db, dataset_id)
        return success_response({"dataset": obj, "preview": {"sample_count": 5}})
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@extra_router.get("/{dataset_id}/studio-url")
async def get_studio_url(dataset_id: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    """
    查找数据集下的 MCAP 文件，生成 MinIO 预签名 URL（有效期 24 小时），
    返回可直接传给 Foxglove Studio 的完整跳转链接。
    """
    try:
        # 找到该数据集下第一个 .mcap 文件
        stmt = (
            select(DataFile)
            .where(
                DataFile.dataset_id == dataset_id,
                DataFile.is_deleted == 0,
            )
            .order_by(DataFile.created_at.asc())
        )
        files = (await db.execute(stmt)).scalars().all()

        mcap_file = next(
            (f for f in files if f.filename and f.filename.lower().endswith(".mcap")),
            None,
        )

        # 如果数据库里没有记录，尝试用数据集名称推断（兼容 mock 数据阶段）
        if mcap_file is None:
            dataset = await dataset_service.get(db, dataset_id)
            if dataset is None:
                raise HTTPException(status_code=404, detail="数据集不存在")
            # 此时没有真实文件记录，返回空
            return success_response({"studio_url": None, "mcap_url": None})

        bucket = mcap_file.bucket_name or settings.minio_bucket
        key = mcap_file.storage_key or mcap_file.file_path.lstrip("/")

        client = _minio_client()
        presigned = client.presigned_get_object(
            bucket_name=bucket,
            object_name=key,
            expires=timedelta(hours=24),
        )

        from urllib.parse import urlencode
        studio_params = urlencode({
            "ds": "remote-file",
            "ds.url": presigned,
            "ds.name": mcap_file.filename,
            "autoplay": "y",
        })
        studio_url = f"https://studio.foxglove.dev/?{studio_params}"

        return success_response({
            "studio_url": studio_url,
            "mcap_url": presigned,
            "filename": mcap_file.filename,
            "expires_in": 86400,
        })

    except HTTPException:
        raise
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}
