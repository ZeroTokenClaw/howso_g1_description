from app.api.v1.crud_factory import build_crud_router
from app.services.user_service import user_service

router = build_crud_router("users", user_service)
