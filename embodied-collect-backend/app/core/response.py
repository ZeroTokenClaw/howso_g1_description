from typing import Any


def success_response(data: Any = None, message: str = "success", total: int | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"code": 200, "message": message, "data": data}
    if total is not None:
        payload["total"] = total
    return payload


def error_response(code: int = 500, message: str = "error", data: Any = None) -> dict[str, Any]:
    return {"code": code, "message": message, "data": data}
