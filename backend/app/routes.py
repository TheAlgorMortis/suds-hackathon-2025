from typing import Annotated
from fastapi import Depends, FastAPI

from app.services.service import Service


async def get_service():
    """
    Injecting service
    """
    service = Service()
    try:
        yield service
    finally:
        # clean up after use
        service.stop()


InjectedService = Annotated[Service, Depends(get_service)]


def init_routes(app: FastAPI):
    """
    Register endpoints used in the app
    """

    @app.get("/hello")
    def hello(service: InjectedService):
        return {"hello": "world"}
