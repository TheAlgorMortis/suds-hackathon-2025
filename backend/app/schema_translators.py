"""
Translate particular db objects into the usable pydantic models
i.e.
SQLAlchemy -> Pydantic
"""

from math import floor
from app.pydantic_models import Module, ModulePreview, Requirement, Review
from app.db_models import Review as DbReview, User as DbUser, Module as DbModule


def module_to_schema(module: DbModule) -> Module:
    return Module(
        moduleId=module.module_id,
        code=module.code,
        name=module.name,
        description=module.description,
        lectureHours=module.lecture_hours,
        tutHours=module.tut_hours,
        reqs=[module_to_requirement_schema(module, r) for r in module.required_modules],
        rating=(
            floor(sum([r.rating for r in module.reviews]) / len(module.reviews))
            if len(module.reviews) != 0
            else 0
        ),
    )


def module_to_preview_schema(module: DbModule) -> ModulePreview:
    """
    Convert module into a preview module, reduced format
    """
    return ModulePreview(
        moduleId=module.module_id,
        code=module.code,
        name=module.name,
        rating=(
            floor(sum([r.rating for r in module.reviews]) / len(module.reviews))
            if len(module.reviews) != 0
            else 0
        ),
    )


def module_to_requirement_schema(parent: DbModule, child: DbModule) -> Requirement:
    """
    Convert db module into (similar) requirement model
    parent defines the module that requires the particular child
    """
    return Requirement(
        moduleId=child.module_id,
        code=child.code,
        type=list(
            filter(lambda x: x.child_id == child.module_id, parent.req_modules_link)
        )[0].requisite_type,
    )


def review_to_schema(review: DbReview) -> Review:
    return Review(
        reviewId=review.review_id,
        userId=review.user_id,
        moduleId=review.module_id,
        title=review.title,
        text=review.text,
        rating=review.rating,
        date=review.date,
    )
