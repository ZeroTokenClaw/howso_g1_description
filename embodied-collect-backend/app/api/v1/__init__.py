from fastapi import APIRouter

from app.api.v1.action_redirect import router as action_redirect_router
from app.api.v1.annotation_tasks import extra_router as annotation_extra_router
from app.api.v1.annotation_tasks import router as annotation_router
from app.api.v1.auth import router as auth_router
from app.api.v1.collection_tasks import extra_router as collection_extra_router
from app.api.v1.collection_tasks import router as collection_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.datasets import extra_router as dataset_extra_router
from app.api.v1.datasets import router as dataset_router
from app.api.v1.devices import router as device_router
from app.api.v1.dict import dict_item_router, dict_type_router
from app.api.v1.import_export import router as import_export_router
from app.api.v1.monitor import alert_router, monitor_router
from app.api.v1.plugins import router as plugin_router
from app.api.v1.projects import router as project_router
from app.api.v1.quality_check import extra_router as quality_extra_router
from app.api.v1.quality_check import router as quality_router
from app.api.v1.recycle_bin import router as recycle_bin_router
from app.api.v1.robots import router as robot_router
from app.api.v1.storage import router as storage_router
from app.api.v1.system import router as system_router
from app.api.v1.users import router as user_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(project_router)
api_router.include_router(device_router)
api_router.include_router(robot_router)
api_router.include_router(collection_router)
api_router.include_router(collection_extra_router)
api_router.include_router(dataset_router)
api_router.include_router(dataset_extra_router)
api_router.include_router(annotation_router)
api_router.include_router(annotation_extra_router)
api_router.include_router(quality_router)
api_router.include_router(quality_extra_router)
api_router.include_router(action_redirect_router)
api_router.include_router(import_export_router)
api_router.include_router(storage_router)
api_router.include_router(plugin_router)
api_router.include_router(monitor_router)
api_router.include_router(alert_router)
api_router.include_router(system_router)
api_router.include_router(recycle_bin_router)
api_router.include_router(dict_type_router)
api_router.include_router(dict_item_router)
api_router.include_router(dashboard_router)
