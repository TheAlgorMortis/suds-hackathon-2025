"""
Handlers that contain business logic between a service and the endpoints
"""

from app.db_models import User
from app.pydantic_models import LoginRequest, LoginResponse
from app.services.service import Service


def handle_login(service: Service, request: LoginRequest) -> str | LoginResponse:
    user: User | None = service.db.get_user_by_username_email(request.username_email)
    if user is None:
        return "Incorrect username or email"
    if user.password != request.password:
        return "Incorrect password"
    return LoginResponse(userId=user.user_id)
