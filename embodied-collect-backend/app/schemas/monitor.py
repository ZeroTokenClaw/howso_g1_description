from pydantic import BaseModel


class LogCreate(BaseModel):
    level: str
    module: str
    action: str
    detail: dict | None = None
