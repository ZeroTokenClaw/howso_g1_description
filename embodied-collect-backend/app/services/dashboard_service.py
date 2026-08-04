from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import AnnotationTask, CollectionTask, DataFile, Dataset, Device, MonitorLog, QualityCheck, Robot


class DashboardService:
    async def overview(self, db: AsyncSession) -> dict:
        total_datasets = (await db.execute(select(func.count()).select_from(Dataset).where(Dataset.is_deleted == 0))).scalar_one()
        total_files = (await db.execute(select(func.count()).select_from(DataFile).where(DataFile.is_deleted == 0))).scalar_one()
        total_size_mb = (
            await db.execute(select(func.coalesce(func.sum(DataFile.file_size_mb), 0)).where(DataFile.is_deleted == 0))
        ).scalar_one()
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_new = (
            await db.execute(select(func.count()).select_from(Dataset).where(Dataset.created_at >= today_start, Dataset.is_deleted == 0))
        ).scalar_one()

        return {
            "data_stats": {
                "total_datasets": int(total_datasets),
                "total_files": int(total_files),
                "total_size_gb": round(float(total_size_mb) / 1024, 2),
                "today_new": int(today_new),
            },
            "task_stats": {
                "collection": await self._task_stat(db, CollectionTask, "running", "completed", "failed"),
                "annotation": await self._task_stat(db, AnnotationTask, "in_progress", "completed", "pending"),
                "quality_check": await self._quality_stat(db),
            },
            "device_stats": await self._status_stat(db, Device, ("online", "offline", "fault")),
            "robot_stats": await self._status_stat(db, Robot, ("online", "offline")),
            "storage_stats": {
                "used_gb": round(float(total_size_mb) / 1024, 2),
                "total_gb": 1024.0,
                "usage_rate": round((float(total_size_mb) / (1024 * 1024)) * 100, 2),
            },
        }

    async def trend(self, db: AsyncSession) -> list[dict]:
        days = []
        for i in range(6, -1, -1):
            day = datetime.utcnow().date() - timedelta(days=i)
            collection_count = (
                await db.execute(
                    select(func.count())
                    .select_from(CollectionTask)
                    .where(func.date(CollectionTask.created_at) == day, CollectionTask.is_deleted == 0)
                )
            ).scalar_one()
            annotation_count = (
                await db.execute(
                    select(func.count())
                    .select_from(AnnotationTask)
                    .where(func.date(AnnotationTask.created_at) == day, AnnotationTask.is_deleted == 0)
                )
            ).scalar_one()
            days.append({
                "date": day.isoformat(),
                "collection": int(collection_count),
                "annotation": int(annotation_count),
            })
        return days

    async def device_list(self, db: AsyncSession) -> list[dict]:
        stmt = select(Device).where(Device.is_deleted == 0).order_by(Device.created_at.desc()).limit(10)
        devices = (await db.execute(stmt)).scalars().all()
        return [
            {
                "id": d.id,
                "name": d.name,
                "type": d.device_type,
                "status": d.status,
                "last_online_time": d.updated_at.isoformat() if d.updated_at else None,
            }
            for d in devices
        ]

    async def recent_logs(self, db: AsyncSession) -> list[dict]:
        stmt = select(MonitorLog).where(MonitorLog.is_deleted == 0).order_by(MonitorLog.created_at.desc()).limit(10)
        logs = (await db.execute(stmt)).scalars().all()
        return [
            {
                "id": log.id,
                "operator": log.operator_id,
                "action": log.action,
                "module": log.module,
                "result": "success",
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ]

    async def _task_stat(self, db: AsyncSession, model: type, running: str, completed: str, failed: str) -> dict:
        total = (await db.execute(select(func.count()).select_from(model).where(model.is_deleted == 0))).scalar_one()
        running_count = (
            await db.execute(select(func.count()).select_from(model).where(model.status == running, model.is_deleted == 0))
        ).scalar_one()
        completed_count = (
            await db.execute(select(func.count()).select_from(model).where(model.status == completed, model.is_deleted == 0))
        ).scalar_one()
        failed_count = (
            await db.execute(select(func.count()).select_from(model).where(model.status == failed, model.is_deleted == 0))
        ).scalar_one()
        return {"total": int(total), "running": int(running_count), "completed": int(completed_count), "failed": int(failed_count)}

    async def _quality_stat(self, db: AsyncSession) -> dict:
        total = (
            await db.execute(select(func.count()).select_from(QualityCheck).where(QualityCheck.is_deleted == 0))
        ).scalar_one()
        pass_avg = (
            await db.execute(select(func.coalesce(func.avg(QualityCheck.pass_rate), 0)).where(QualityCheck.is_deleted == 0))
        ).scalar_one()
        return {"total": int(total), "pass_rate": round(float(pass_avg), 2)}

    async def _status_stat(self, db: AsyncSession, model: type, statuses: tuple[str, ...]) -> dict:
        total = (await db.execute(select(func.count()).select_from(model).where(model.is_deleted == 0))).scalar_one()
        data: dict = {"total": int(total)}
        for status in statuses:
            c = (
                await db.execute(select(func.count()).select_from(model).where(model.status == status, model.is_deleted == 0))
            ).scalar_one()
            data[status] = int(c)
        return data


dashboard_service = DashboardService()
