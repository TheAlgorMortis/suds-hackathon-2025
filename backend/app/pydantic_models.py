"""
All Pydantic models, used for network facing parsing both ways
"""

from typing import ClassVar
from pydantic import (
    UUID4,
    BaseModel,
    ConfigDict,
    Field,
    field_serializer,
    model_validator,
)

from app.db_models import RequisiteEnum


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
