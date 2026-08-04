from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, verify_password
from app.models.base import Role, User, user_role


class AuthService:
    async def login(self, db: AsyncSession, username: str, password: str) -> dict:
        user = (
            await db.execute(select(User).where(User.username == username, User.is_deleted == 0))
        ).scalar_one_or_none()
        if not user or not verify_password(password, user.password_hash):
            return {}
        role_stmt = (
            select(Role.code)
            .join(user_role, user_role.c.role_id == Role.id)
            .where(user_role.c.user_id == user.id, user_role.c.is_deleted == 0, Role.is_deleted == 0)
        )
        role_codes = (await db.execute(role_stmt)).scalars().all()
        return {
            "access_token": create_access_token(user.id, list(role_codes)),
            "refresh_token": create_refresh_token(user.id),
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "avatar_url": user.avatar_url,
                "status": user.status,
            },
        }


auth_service = AuthService()
