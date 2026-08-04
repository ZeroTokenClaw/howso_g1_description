from app.api.v1.crud_factory import build_crud_router
from app.models.base import Robot
from app.services.base_service import CRUDService

router = build_crud_router("robots", CRUDService(Robot))
