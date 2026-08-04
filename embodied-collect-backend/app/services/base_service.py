from collections.abc import Sequence
from datetime import datetime
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import MonitorLog


class CRUDService:
    def __init__(self, model: type):
        self.model = model

    async def list(
        self,
        db: AsyncSession,
        *,
        page: int = 1,
        page_size: int = 20,
        keyword: str | None = None,
        status: str | None = None,
        project_id: str | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[list[Any], int]:
        conditions = [self.model.is_deleted == 0]
        if keyword and hasattr(self.model, "name"):
            conditions.append(self.model.name.like(f"%{keyword}%"))
        if status and hasattr(self.model, "status"):
            conditions.append(self.model.status == status)
        if project_id and hasattr(self.model, "project_id"):
            conditions.append(self.model.project_id == project_id)
        stmt = select(self.model).where(*conditions)
        sort_col = getattr(self.model, sort_by, self.model.created_at)
        stmt = stmt.order_by(sort_col.desc() if sort_order.lower() == "desc" else sort_col.asc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        rows = (await db.execute(stmt)).scalars().all()
        count_stmt = select(func.count()).select_from(self.model).where(*conditions)
        total = (await db.execute(count_stmt)).scalar_one()
        return list(rows), int(total)

    async def get(self, db: AsyncSession, record_id: str) -> Any | None:
        stmt = select(self.model).where(self.model.id == record_id, self.model.is_deleted == 0)
        return (await db.execute(stmt)).scalar_one_or_none()

    async def create(self, db: AsyncSession, payload: dict[str, Any]) -> Any:
        obj = self.model(**payload)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, record_id: str, payload: dict[str, Any]) -> Any | None:
        obj = await self.get(db, record_id)
        if not obj:
            return None
        for key, value in payload.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        obj.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(obj)
        return obj

    async def soft_delete(self, db: AsyncSession, record_id: str) -> bool:
        obj = await self.get(db, record_id)
        if not obj:
            return False
        obj.is_deleted = True
        obj.updated_at = datetime.utcnow()
        await db.commit()
        return True

    async def batch_soft_delete(self, db: AsyncSession, ids: Sequence[str]) -> int:
        count = 0
        for rid in ids:
            if await self.soft_delete(db, rid):
                count += 1
        return count


async def write_monitor_log(
    db: AsyncSession,
    *,
    module: str,
    action: str,
    operator_id: str | None,
    level: str = "INFO",
    detail: dict | None = None,
) -> None:
    log = MonitorLog(
        level=level,
        module=module,
        action=action,
        operator_id=operator_id,
        detail=detail,
    )
    db.add(log)
    await db.commit()
