from typing import Annotated
from fastapi import Depends, FastAPI

from app.schema_translators import module_to_schema
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

    # TODO: should allow query params for filtering
    @app.get("/api/v1/users/search")
    def search_users(service: InjectedService):
        # TODO: impl filtering
        return service.db.get_all_users()

    @app.get("/api/v1/modules/search")
    def search_modules(service: InjectedService):
        # TODO: impl filtering
        return [module_to_schema(mod) for mod in service.db.get_all_modules()]
