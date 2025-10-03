import uuid
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session, sessionmaker
from app.db_models import User as DbUser, Module as DbModule

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
    def get_all_users(self) -> list[DbUser]:
        return list(self.session.scalars(select(DbUser)))

    def get_user_by_id(self, user_id: uuid.UUID) -> DbUser:
        user = self.session.scalar(select(DbUser).where(DbUser.user_id == user_id))
        if user is None:
            raise ValueError(f"User with id {user_id} not present")
        return user

    # ---- MODULES ----
    def get_all_modules(self) -> list[DbModule]:
        return list(self.session.scalars(select(DbModule)))

    def clear_database(self):
        _ = self.session.execute(
            text(
                """
            TRUNCATE TABLE
                modules,
                registrations,
                requisites,
                reviews,
                users,
                votes,
            RESTART IDENTITY CASCADE;
            """
            )
        )
        self.session.commit()

    def close(self):
        """
        Close db connection
        """
        self.session.close()
