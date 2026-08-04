from app.api.v1.crud_factory import build_crud_router
from app.services.storage_service import storage_service

router = build_crud_router("storage", storage_service)
