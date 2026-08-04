from app.api.v1.crud_factory import build_crud_router
from app.services.project_service import project_service

router = build_crud_router("projects", project_service)
