"""
Handlers that contain business logic between a service and the endpoints
"""

from functools import reduce
import uuid
from app.db_models import Status, User as DbUser, VoteEnum
from app.pydantic_models import (
    LoginRequest,
    LoginResponse,
    ModuleInfo,
    ModulePreview,
    User,
    Review,
    UserReview,
)
from app.schema_translators import module_to_preview_schema
from app.services.service import Service


def handle_login(service: Service, request: LoginRequest) -> str | LoginResponse:
    user: DbUser | None = service.db.get_user_by_username_email(request.username_email)
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


def handle_get_all_user_info(username: str, service: Service) -> User:
    user = service.db.get_user_by_username_email(username)
    assert user is not None
    total_votes = sum(
        sum(1 if v.vote == VoteEnum.UP else -1 for v in r.votes) for r in user.reviews
    )
    return User(
        username=user.username,
        name=user.name,
        totalVotes=total_votes,
        email=user.email,
        takingModules=[
            ModuleInfo(
                name=reg.module.name,
                code=reg.module.code,
                status=reg.status,
            )
            for reg in user.registrations
        ],
        tutoringModules=[
            ModuleInfo(name=mod.name, code=mod.code) for mod in user.tutor.modules
        ],
        reviews=[
            UserReview(name=rev.module.name, code=rev.module.code, rating=rev.rating)
            for rev in user.reviews
        ],
    )
