from datetime import datetime
from enum import Enum
import uuid
from sqlalchemy import (
    UUID,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    PrimaryKeyConstraint,
    String,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Status(str, Enum):
    NOT_REGISTERED = "notRegistered"
    IN_PROGRESS = "inProgress"
    FAILED = "failed"
    PASSED = "passed"
    DISTINCTION = "distinction"


class VoteEnum(str, Enum):
    UP = "up"
    DOWN = "down"


class RequisiteEnum(str, Enum):
    COREQ = "coreq"
    PREREQ = "prereq"
    PREREQ_PASS = "prereqPass"


class Base(DeclarativeBase):
    """
    Allows the ORM mapped classes for classes that subclass Base
    """

    pass


class User(Base):
    __tablename__: str = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    username: Mapped[str] = mapped_column(
        String(30), unique=True, nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(30), nullable=False)

    password: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    # magical relationship linking
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="user")
    registrations: Mapped[list["Registration"]] = relationship(
        "Registration", back_populates="user"
    )
    votes: Mapped[list["Vote"]] = relationship("Vote", back_populates="user")


class Module(Base):
    __tablename__: str = "modules"

    module_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(10000))
    lecture_hours: Mapped[int] = mapped_column(Integer)
    tut_hours: Mapped[int] = mapped_column(Integer)

    # magical relationship linking
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="module")
    registrations: Mapped[list["Registration"]] = relationship(
        "Registration", back_populates="module"
    )

    # modules that are required to take this
    req_modules_link: Mapped[list["Requisite"]] = relationship(
        "Requisite", foreign_keys="Requisite.parent_id", back_populates="parent"
    )
    requisite_modules_link: Mapped[list["Requisite"]] = relationship(
        "Requisite", foreign_keys="Requisite.child_id", back_populates="child"
    )

    # some weird direct many-to-many association proxy
    required_modules: Mapped[list["Module"]] = relationship(
        "Module",
        secondary="requisites",
        primaryjoin="Module.module_id==Requisite.parent_id",
        secondaryjoin="Module.module_id==Requisite.child_id",
        viewonly=True,
    )


class Registration(Base):
    __tablename__: str = "registrations"

    status: Mapped[Status] = mapped_column(
        SAEnum(Status, name="status"), nullable=False
    )
    module_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))

    # magical relationship linking
    module: Mapped[Module] = relationship("Module", back_populates="registrations")
    user: Mapped[User] = relationship("User", back_populates="registrations")

    # composite foreign key
    __table_args__ = (
        ForeignKeyConstraint(["user_id"], ["users.user_id"]),
        ForeignKeyConstraint(["module_id"], ["modules.module_id"]),
        PrimaryKeyConstraint("user_id", "module_id"),
    )


class Review(Base):
    __tablename__: str = "reviews"
    review_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # foreign keys
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.user_id"))
    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("modules.module_id"))
    title: Mapped[str] = mapped_column(String(100))
    text: Mapped[str] = mapped_column(String(10000))
    # 0-10
    rating: Mapped[int] = mapped_column(Integer)
    date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    # magical relationship
    user: Mapped[User] = relationship("User", back_populates="reviews")
    module: Mapped[Module] = relationship("Module", back_populates="reviews")
    votes: Mapped[list["Vote"]] = relationship("Vote", back_populates="review")

    __table_args__ = (
        CheckConstraint("rating >= 0"),
        CheckConstraint("rating <= 10"),
    )


class Vote(Base):
    __tablename__: str = "votes"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    review_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    vote: Mapped[VoteEnum] = mapped_column(
        SAEnum(VoteEnum, name="vote"), nullable=False
    )

    # magical relationship linking
    user: Mapped[User] = relationship("User", back_populates="votes")
    review: Mapped[Review] = relationship("Review", back_populates="votes")

    # composite foreign key
    __table_args__ = (
        ForeignKeyConstraint(["user_id"], ["users.user_id"]),
        ForeignKeyConstraint(["review_id"], ["reviews.review_id"]),
        PrimaryKeyConstraint("user_id", "review_id"),
    )


class Requisite(Base):
    __tablename__: str = "requisites"
    parent_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    child_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    requisite_type: Mapped[RequisiteEnum] = mapped_column(
        SAEnum(RequisiteEnum, name="requisite_type"), nullable=False
    )

    # magical relationship linking
    # module that needs the req
    parent: Mapped[Module] = relationship(
        "Module", foreign_keys=[parent_id], back_populates="req_modules_link"
    )
    # module that is the req
    child: Mapped[Module] = relationship(
        "Module", foreign_keys=[child_id], back_populates="requisite_modules_link"
    )

    __table_args__ = (
        ForeignKeyConstraint(["parent_id"], ["modules.module_id"]),
        ForeignKeyConstraint(["child_id"], ["modules.module_id"]),
        PrimaryKeyConstraint("parent_id", "child_id"),
    )
