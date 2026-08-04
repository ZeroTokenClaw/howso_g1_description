from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PageParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=200)
    keyword: str | None = None
    status: str | None = None
    project_id: str | None = None
    sort_by: str = "created_at"
    sort_order: str = "desc"


class IdPayload(BaseModel):
    id: str


class BatchDeletePayload(BaseModel):
    ids: list[str]


class BaseOut(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    model_config = {"from_attributes": True}


class GenericIn(BaseModel):
    payload: dict[str, Any] = Field(default_factory=dict)


class GenericUpdate(BaseModel):
    payload: dict[str, Any] = Field(default_factory=dict)
