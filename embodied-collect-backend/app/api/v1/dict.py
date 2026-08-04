from app.api.v1.crud_factory import build_crud_router
from app.models.base import DictItem, DictType
from app.services.base_service import CRUDService

dict_type_router = build_crud_router("dict-types", CRUDService(DictType))
dict_item_router = build_crud_router("dict-items", CRUDService(DictItem))
