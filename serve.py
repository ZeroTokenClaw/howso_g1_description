"""
MCAP 文件服务器 - 支持 CORS + Range 请求（Foxglove Studio 需要）

用法：
    把这个文件放到 MCAP 文件所在目录，然后运行：
    python serve.py

依赖（后端已有）：
    pip install uvicorn starlette
"""

import os
import uvicorn
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import FileResponse, Response
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles

PORT = 8899
# 当前目录作为文件根目录
SERVE_DIR = os.path.dirname(os.path.abspath(__file__))


async def health(request: Request) -> Response:
    return Response("ok")


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET", "HEAD", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["Content-Length", "Content-Range", "Accept-Ranges"],
    )
]

app = Starlette(
    routes=[
        Route("/health", health),
        Mount("/", app=StaticFiles(directory=SERVE_DIR, html=False)),
    ],
    middleware=middleware,
)

if __name__ == "__main__":
    print(f"✅ MCAP 文件服务器启动中...")
    print(f"   目录：{SERVE_DIR}")
    print(f"   地址：http://192.168.0.157:{PORT}/")
    print(f"   示例：http://192.168.0.157:{PORT}/episode_00048_2026_02_09_12_17_58.mcap")
    print(f"   按 Ctrl+C 停止\n")
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
