from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_token(
    subject: str,
    expires_minutes: int,
    extra: dict[str, Any] | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str, role_codes: list[str] | None = None) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.access_token_expire_minutes,
        extra={"type": "access", "roles": role_codes or []},
    )


def create_refresh_token(subject: str) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.refresh_token_expire_minutes,
        extra={"type": "refresh"},
    )
