"""
Handlers that contain business logic between a service and the endpoints
"""

import uuid
from app.db_models import User
from app.pydantic_models import LoginRequest, LoginResponse, ModulePreview
from app.schema_translators import module_to_preview_schema
from app.services.service import Service


def handle_login(service: Service, request: LoginRequest) -> str | LoginResponse:
    user: User | None = service.db.get_user_by_username_email(request.username_email)
    if user is None:
        return "Incorrect username or email"
    if user.password != request.password:
        return "Incorrect password"
    return LoginResponse(userId=user.user_id)


def handle_modules_for_tutor(
    tutor_id: uuid.UUID, service: Service
) -> list[ModulePreview]:
    tutor = service.db.get_tutor_by_id(tutor_id)
    if tutor is None:
        return []
    return [module_to_preview_schema(mod) for mod in tutor.modules]
