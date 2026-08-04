from app.models.base import StorageConfig
from app.services.base_service import CRUDService

storage_service = CRUDService(StorageConfig)
