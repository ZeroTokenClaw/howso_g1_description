from fastapi import APIRouter, Depends
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db_session
from app.core.deps import get_current_user
from app.core.response import success_response
from app.core.security import create_access_token
from app.models.base import User
from app.schemas.auth import LoginRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        token_data = await auth_service.login(db, payload.username, payload.password)
        if not token_data:
            return {"code": 401, "message": "用户名或密码错误", "data": None}
        return success_response(token_data)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.post("/logout")
async def logout(_: User = Depends(get_current_user)) -> dict:
    try:
        return success_response({"logout": True})
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)) -> dict:
    try:
        return success_response(current_user)
    except Exception as exc:
        return {"code": 500, "message": str(exc), "data": None}


@router.post("/refresh")
async def refresh(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "refresh" or not payload.get("sub"):
            return {"code": 401, "message": "非法refresh token", "data": None}
        return success_response({"access_token": create_access_token(payload["sub"]), "token_type": "bearer"})
    except JWTError:
        return {"code": 401, "message": "token无效", "data": None}
