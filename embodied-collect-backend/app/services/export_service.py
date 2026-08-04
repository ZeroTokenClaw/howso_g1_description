from app.models.base import ExportJob, ImportJob
from app.services.base_service import CRUDService

import_service = CRUDService(ImportJob)
export_service = CRUDService(ExportJob)
