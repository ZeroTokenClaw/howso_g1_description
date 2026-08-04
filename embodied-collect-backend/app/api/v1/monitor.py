from app.api.v1.crud_factory import build_crud_router
from app.models.base import AlertRule, MonitorLog
from app.services.base_service import CRUDService

monitor_router = build_crud_router("monitor", CRUDService(MonitorLog))
alert_router = build_crud_router("alert-rules", CRUDService(AlertRule))
