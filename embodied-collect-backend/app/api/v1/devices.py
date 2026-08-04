from app.api.v1.crud_factory import build_crud_router
from app.services.device_service import device_service

router = build_crud_router("devices", device_service)
