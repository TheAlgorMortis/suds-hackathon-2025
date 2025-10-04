"""
Translate particular db objects into the usable pydantic models
i.e.
SQLAlchemy -> Pydantic
"""

from math import floor
from uuid import UUID
from app.pydantic_models import (
    Module,
    ModulePreview,
    Requirement,
    Review,
    Tutor,
)
from app.db_models import (
    Review as DbReview,
    User as DbUser,
    Module as DbModule,
    Vote,
    VoteEnum,
    Tutor as DbTutor,
)


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


def review_to_schema(review: DbReview, user_id: UUID) -> Review:
    vote_list: list[Vote] = review.votes
    votes: int = 0
    matches = list(filter(lambda x: x.user_id == user_id, review.votes))
    user_vote = None if len(matches) == 0 else matches[0].vote

    for vote in vote_list:
        votes += 1 if vote.vote == VoteEnum.UP else -1

    return Review(
        reviewId=review.review_id,
        username=review.user.username,
        title=review.title,
        text=review.text,
        rating=review.rating,
        date=review.date,
        votes=votes,
        userVote=user_vote,
    )


def tutor_to_schema(
    tutor: DbTutor,  # , with_modules: bool = False
) -> Tutor:  # | TutorWithModules:
    return (
        Tutor(
            username=tutor.user.username,
            name=tutor.user.name,
            email=tutor.user.email,
            description=tutor.description,
            hourlyRate=tutor.hourly_rate,
        )
        # if not with_modules
        # else TutorWithModules(
        #    username=tutor.user.username,
        #    name=tutor.user.name,
        #    email=tutor.user.email,
        #    description=tutor.description,
        #    hourlyRate=tutor.hourly_rate,
        #    modules=[module_to_preview_schema(t) for t in tutor.modules],
        # )
    )
