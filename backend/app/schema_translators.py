"""
Translate particular db objects into the usable pydantic models
i.e.
SQLAlchemy -> Pydantic
"""

from app.pydantic_models import Module, Requirement
from app.db_models import User as DbUser, Module as DbModule


def module_to_schema(module: DbModule) -> Module:
    return Module(
        moduleId=module.module_id,
        code=module.code,
        name=module.name,
        description=module.description,
        lectureHours=module.lecture_hours,
        tutHours=module.tut_hours,
        reqs=[module_to_requirement_schema(module, r) for r in module.required_modules],
    )


def module_to_requirement_schema(parent: DbModule, child: DbModule) -> Requirement:
    """
    Convert db module into (similar) requirement model
    parent defines the module that requires the particular child
    """
    return Requirement(
        moduleId=child.module_id,
        code=child.code,
        name=child.name,
        type=list(
            filter(lambda x: x.child_id == child.module_id, parent.req_modules_link)
        )[0].requisite_type,
    )
