from collections.abc import Callable

from fastapi import Depends, Header
from jose import JWTError, jwt
from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db_session
from app.core.exceptions import BizException
from app.models.base import Permission, Role, User, user_role, role_permission


async def get_current_user(
    db: AsyncSession = Depends(get_db_session),
    authorization: str | None = Header(default=None),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise BizException("未登录", 401)
    token = authorization.replace("Bearer ", "", 1).strip()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            raise BizException("非法令牌", 401)
        user_id = payload.get("sub")
        if not user_id:
            raise BizException("非法令牌", 401)
    except JWTError as exc:
        raise BizException("令牌解析失败", 401) from exc

    stmt: Select[tuple[User]] = select(User).where(User.id == user_id, User.is_deleted == 0)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise BizException("用户不存在或已删除", 401)
    return user


async def get_user_permissions(user_id: str, db: AsyncSession) -> set[str]:
    stmt = (
        select(Permission.code)
        .join(role_permission, Permission.id == role_permission.c.permission_id)
        .join(Role, Role.id == role_permission.c.role_id)
        .join(user_role, user_role.c.role_id == Role.id)
        .where(
            user_role.c.user_id == user_id,
            Role.is_deleted == 0,
            Permission.is_deleted == 0,
            role_permission.c.is_deleted == 0,
            user_role.c.is_deleted == 0,
        )
    )
    result = await db.execute(stmt)
    return set(result.scalars().all())


def require_permission(permission_code: str) -> Callable:
    async def checker(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db_session),
    ) -> User:
        perms = await get_user_permissions(current_user.id, db)
        if permission_code not in perms and "super_admin" not in perms:
            raise BizException("无权限访问", 403)
        return current_user

    return checker
