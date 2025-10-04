"""
All Pydantic models, used for network facing parsing both ways
"""

from datetime import datetime
from typing import ClassVar
from pydantic import (
    UUID4,
    BaseModel,
    ConfigDict,
    Field,
    field_serializer,
    model_validator,
)

from app.db_models import RequisiteEnum, VoteEnum


# class User(BaseModel):
#     model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
#
#     user_id: UUID4


class Requirement(BaseModel):
    """
    A required module in the form of prereq, coreq, pass prereq
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    module_id: UUID4 = Field(..., alias="moduleId")
    code: str
    req_type: RequisiteEnum = Field(..., alias="type")

    @field_serializer("module_id")
    def uuid_to_string(self, uuid: UUID4) -> str:
        return str(uuid)


class ModulePreview(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    module_id: UUID4 = Field(..., alias="moduleId")
    code: str
    name: str
    rating: int

    @field_serializer("module_id")
    def uuid_to_string(self, uuid: UUID4) -> str:
        return str(uuid)


class Module(ModulePreview):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    description: str
    lecture_hours: int = Field(..., alias="lectureHours")
    tut_hours: int = Field(..., alias="tutHours")
    requirements: list[Requirement] = Field(..., alias="reqs")


class LoginRequest(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)

    # either one
    username_email: str = Field(..., alias="usernameEmail")
    password: str


class LoginResponse(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    user_id: UUID4 = Field(..., alias="userId")

    @field_serializer("user_id")
    def uuid_to_string(self, uuid: UUID4) -> str:
        return str(uuid)


class CreateReview(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)

    user_id: UUID4 = Field(..., alias="userId")
    module_id: UUID4 = Field(..., alias="moduleId")
    title: str
    text: str
    # 0-10
    rating: int

    @field_serializer("module_id", "user_id")
    def uuid_to_string(self, uuid: UUID4) -> str:
        return str(uuid)


class Review(BaseModel):
    """
    Review as seen on frontend
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)

    review_id: UUID4 = Field(..., alias="reviewId")
    username: str
    title: str
    text: str
    rating: int
    date: datetime
    # reddit style
    votes: int
    user_vote: VoteEnum | None = Field(None, alias="userVote")

    @field_serializer("review_id")
    def uuid_to_string(self, uuid: UUID4) -> str:
        return str(uuid)


class Vote(BaseModel):
    """
    Used for creating votes
    """

    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    review_id: UUID4 = Field(..., alias="reviewId")
    user_id: UUID4 = Field(..., alias="userId")
    vote: VoteEnum | None = None


class Tutor(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)

    username: str
    name: str
    email: str
    description: str
    hourly_rate: int = Field(..., alias="hourlyRate")


class TutorWithModules(Tutor):
    model_config: ClassVar[ConfigDict] = ConfigDict(populate_by_name=True)
    modules: list[ModulePreview]
