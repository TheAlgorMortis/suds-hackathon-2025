from datetime import datetime
import uuid
from sqlalchemy import create_engine, delete, insert, or_, select, text
from sqlalchemy.orm import Session, sessionmaker
from app.pydantic_models import CreateReview, Vote
from app.db_models import (
    Registration,
    Status,
    Tutor,
    User,
    Module,
    Review as DbReview,
    Vote as DbVote,
    VoteEnum,
)

POSTGRES_DB_URL = "postgresql://user:password@localhost:5432/backend_db"


class DbService:
    """
    Manages all SQLAlchemy interactions, often returning Pydantic models for further use outside the service
    """

    def __init__(self) -> None:
        engine = create_engine(POSTGRES_DB_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        self.session: Session = SessionLocal()

    # ----- USERS -----
    def get_all_users(self) -> list[User]:
        return list(self.session.scalars(select(User)))

    def get_user_by_id(self, user_id: uuid.UUID) -> User:
        user = self.session.scalar(select(User).where(User.user_id == user_id))
        if user is None:
            raise ValueError(f"User with id {user_id} not present")
        return user

    def get_user_by_username_email(self, username_email: str) -> User | None:
        """
        Get user using email or username, either
        """
        return self.session.scalar(
            select(User).where(
                or_(User.username == username_email, User.email == username_email)
            )
        )

    def get_user_modules(self, user_id: uuid.UUID) -> list[Module]:
        """
        Get all module objects for a user with provided id
        """
        user = self.get_user_by_id(user_id)
        return [reg.module for reg in user.registrations]

    # ---- MODULES ----
    def get_all_modules(self) -> list[Module]:
        return list(self.session.scalars(select(Module)))

    def get_module_by_id(self, module_id: uuid.UUID) -> Module:
        module = self.session.scalar(
            select(Module).where(Module.module_id == module_id)
        )
        if module is None:
            raise ValueError(f"Module with id {module_id} not present")
        return module

    def get_module_by_code(self, module_code: str) -> Module | None:
        return self.session.scalar(select(Module).where(Module.code == module_code))

    def get_required_modules(self, module_id: uuid.UUID) -> list[Module]:
        """
        List of all modules required by the module with given id
        """
        module = self.get_module_by_id(module_id)
        return module.required_modules

    def get_module_status(self, user_id: uuid.UUID, module_id: uuid.UUID) -> Status:
        """
        Enrollment status of a user for a particular module
        """
        reg = self.session.scalar(
            select(Registration).where(
                Registration.module_id == module_id, Registration.user_id == user_id
            )
        )
        return reg.status if reg is not None else Status.NOT_REGISTERED

    # ----- REVIEWS -----
    def insert_review(self, review: CreateReview):

        _ = self.session.execute(
            insert(DbReview).values(
                user_id=review.user_id,
                module_id=review.module_id,
                title=review.title,
                text=review.text,
                rating=review.rating,
                date=datetime.now(),
            )
        )
        self.session.commit()

    def update_review(self, review: CreateReview):
        existing_review = self.session.scalar(
            select(DbReview).where(
                DbReview.module_id == review.module_id,
                DbReview.user_id == review.user_id,
            )
        )
        if existing_review is None:
            raise ValueError("Review does not exist")

        existing_review.text = review.text
        existing_review.title = review.title
        existing_review.rating = review.rating
        existing_review.date = datetime.now()
        self.session.commit()

    def delete_review(self, module_id: uuid.UUID, user_id: uuid.UUID):
        _ = self.session.execute(
            delete(DbReview).where(
                DbReview.module_id == module_id, DbReview.user_id == user_id
            )
        )
        self.session.commit()

    # ---- VOTES -----
    def set_vote(self, vote: Vote):
        """
        Update or insert a vote from a user for a review
        """
        existing_vote = self.session.scalar(
            select(DbVote).where(
                DbVote.user_id == vote.user_id, DbVote.review_id == vote.review_id
            )
        )
        if existing_vote is None:
            # new post

            if vote.vote is None:
                # this should never happen becaus you can't vote None without having a prior vote
                return
            # insert the appropriate new vote
            _ = self.session.execute(
                insert(DbVote).values(
                    vote=vote.vote, user_id=vote.user_id, review_id=vote.review_id
                )
            )
            self.session.commit()
        else:  # existing post, update
            if vote.vote is None:
                # want to delete
                _ = self.session.execute(
                    delete(DbVote).where(
                        DbVote.review_id == vote.review_id,
                        DbVote.user_id == vote.user_id,
                    )
                )
                self.session.commit()
            else:
                # update value
                existing_vote.vote = vote.vote
                self.session.commit()

    # ---- OTHER -----

    def clear_database(self):
        tables = ["votes", "reviews", "requisites", "registrations", "modules", "users"]

        for table in tables:
            _ = self.session.execute(
                text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;")
            )
        self.session.commit()

    def get_tutors(self, module_id: uuid.UUID) -> list[Tutor]:
        mod = self.get_module_by_id(module_id)
        return mod.tutors

    def get_tutor_by_id(self, tutor_id: uuid.UUID) -> Tutor | None:
        return self.session.scalar(select(Tutor).where(Tutor.user_id == tutor_id))

    def close(self):
        """
        Close db connection
        """
        self.session.close()
