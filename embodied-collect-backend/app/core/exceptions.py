from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware

from app.core.response import error_response


class BizException(Exception):
    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code
        super().__init__(message)


def _cors_response(response: JSONResponse, request: Request) -> JSONResponse:
    """Add CORS headers to error responses so the browser can read them."""
    origin = request.headers.get("origin", "*")
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(BizException)
    async def handle_biz_exception(request: Request, exc: BizException) -> JSONResponse:
        return _cors_response(
            JSONResponse(status_code=200, content=error_response(code=exc.code, message=exc.message)),
            request,
        )

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return _cors_response(
            JSONResponse(status_code=exc.status_code, content=error_response(code=exc.status_code, message=exc.detail)),
            request,
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_exception(request: Request, exc: RequestValidationError) -> JSONResponse:
        return _cors_response(
            JSONResponse(status_code=422, content=error_response(code=422, message="参数校验失败", data=exc.errors())),
            request,
        )

    @app.exception_handler(Exception)
    async def handle_common_exception(request: Request, exc: Exception) -> JSONResponse:
        return _cors_response(
            JSONResponse(status_code=500, content=error_response(code=500, message=str(exc))),
            request,
        )
