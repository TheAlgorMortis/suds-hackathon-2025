from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from pydantic import UUID4

from app.handlers import handle_login
from app.pydantic_models import LoginRequest
from app.schema_translators import module_to_preview_schema, module_to_schema
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
    @app.get("/api/v1/users")
    def search_users(service: InjectedService):
        # TODO: impl filtering
        return service.db.get_all_users()

    @app.get("/api/v1/previews")
    def filtered_module_previews(service: InjectedService):
        """
        Module preview searching
        """
        # TODO: impl filtering
        return [module_to_preview_schema(mod) for mod in service.db.get_all_modules()]

    @app.get("/api/v1/modules/{module_code}")
    def get_module(module_code: str, service: InjectedService):
        """
        Get single module using module code
        """
        mod = service.db.get_module_by_code(module_code)
        if mod is None:
            raise HTTPException(status_code=404, detail="Module doesn't exist")
        return module_to_schema(mod)

    @app.post("/api/v1/auth/login")
    def login(request: LoginRequest, service: InjectedService):
        err: str | None = handle_login(service, request)
        if err is None:
            return {}  # pyright: ignore[reportUnknownVariableType]
        raise HTTPException(status_code=401, detail=err)
